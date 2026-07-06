using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ControleDeGastos.Data;
using ControleDeGastos.Modelos;

namespace ControleDeGastos.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PessoasController : ControllerBase
    {
        private readonly AppDbContext _context;

        public PessoasController(AppDbContext context)
        {
            _context = context;
        }

    [HttpPost]
    public async Task<IActionResult> CriarPessoa([FromBody] Pessoa pessoa)
    {
        // Validação: Garante nome preenchido, apenas letras (com acentos) e idade válida
        if (string.IsNullOrWhiteSpace(pessoa.Nome) || 
            !System.Text.RegularExpressions.Regex.IsMatch(pessoa.Nome, @"^[a-zA-ZÀ-ÿ\s]+$") || 
            pessoa.Idade < 0 || pessoa.Idade > 150)
        {
            return BadRequest("Dados inválidos. O nome deve conter apenas letras e espaços."); // Se algum dado for inválido, essa mensagem é apresentada
        }

        // Verificação se o ID (que deve ser único) já existe
        var random = new Random();
        bool idJaExiste = true;

        // Enquanto o ID gerado já constar no banco de dados, ele continuará gerando um novo
        while (idJaExiste)
        {
            // Caso o ID já exista, um novo será gerado nessa seção
            var novoId = random.Next(100000, 999999);
        
            // Nova verificação se o ID já está cadastrado no banco de dados
            idJaExiste = await _context.Pessoas.AnyAsync(p => p.Id == novoId);

            if (!idJaExiste) // Verificação se o ID é único (ainda não existe)
            {
                pessoa.Id = novoId; // Se o ID for único, será cadastrado a pessoa
            }
        }

        _context.Pessoas.Add(pessoa);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(ListarPessoas), new { id = pessoa.Id }, pessoa);
    }
        [HttpGet]
        public async Task<IActionResult> ListarPessoas() // Listagem de pessoas
        {
            var pessoas = await _context.Pessoas.ToListAsync();
            return Ok(pessoas);
        }

        [HttpDelete("{id}")] // Função para deletar pessoas
        public async Task<IActionResult> DeletarPessoa(int id)
        {
            var pessoa = await _context.Pessoas.FindAsync(id);
            if (pessoa == null)
            {
                return NotFound("Pessoa não encontrada.");
            }

            _context.Pessoas.Remove(pessoa); // Remove a pessoa e faz a remoção das transações vinculadas
            await _context.SaveChangesAsync(); 

            return NoContent();
        }

        [HttpGet("totais")] // Consulta de totais por residente
        public async Task<IActionResult> ObterTotais()
        {
            // Busca todas as pessoas trazendo junto suas transações salvas
            var pessoasComTransacoes = await _context.Pessoas
                .Include(p => p.Transacoes)
                .ToListAsync();

            // Mapeia os dados calculando os totais individuais de cada pessoa
            var listagemPessoas = pessoasComTransacoes.Select(p => new
            {
                p.Id,
                p.Nome,
                p.Idade,
                TotalReceitas = p.Transacoes.Where(t => t.Tipo.ToLower() == "receita").Sum(t => t.Valor),
                TotalDespesas = p.Transacoes.Where(t => t.Tipo.ToLower() == "despesa").Sum(t => t.Valor),
                Saldo = p.Transacoes.Where(t => t.Tipo.ToLower() == "receita").Sum(t => t.Valor) - 
                        p.Transacoes.Where(t => t.Tipo.ToLower() == "despesa").Sum(t => t.Valor)
            }).ToList();

            // Calcula o resumo geral (Total de todas as pessoas juntas)
            var totalGeralReceitas = listagemPessoas.Sum(p => p.TotalReceitas);
            var totalGeralDespesas = listagemPessoas.Sum(p => p.TotalDespesas);
            var saldoLiquidoGeral = totalGeralReceitas - totalGeralDespesas;

            // Estruturação de exibição do resultado final
            var resultadoFinal = new
            {
                Pessoas = listagemPessoas,
                ResumoGeral = new
                {
                    TotalReceitas = totalGeralReceitas,
                    TotalDespesas = totalGeralDespesas,
                    SaldoLiquido = saldoLiquidoGeral
                }
            };

            return Ok(resultadoFinal);
        }
    }
}