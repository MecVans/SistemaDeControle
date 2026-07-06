using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ControleDeGastos.Data;
using ControleDeGastos.Modelos;

namespace ControleDeGastos.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TransacoesController : ControllerBase
    {
        private readonly AppDbContext _context;

        public TransacoesController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> ListarTransacoes()
        {
            // Retorna as transações incluindo o Nome da pessoa associada para facilitar a exibição
            var transacoes = await _context.Transacoes
                .Include(t => t.Pessoa)
                .Select(t => new {
                    t.Id,
                    t.Descricao,
                    t.Valor,
                    t.Tipo,
                    t.PessoaId,
                    NomePessoa = t.Pessoa != null ? t.Pessoa.Nome : "Desconhecido"
                })
                .ToListAsync();

            return Ok(transacoes);
        }

        [HttpPost]
        public async Task<IActionResult> CriarTransacao([FromBody] Transacao transacao)
        {
            // Verifica se a pessoa informada realmente existe no banco de dados
            var pessoa = await _context.Pessoas.FindAsync(transacao.PessoaId); // Busca usando o ID
            if (pessoa == null)
            {
                return BadRequest("A pessoa informada para esta transação não existe.");
            }

            if (transacao.Valor <= 0) // Filtro para garantir que é uma transação válida (Maior que 0)
            {
                return BadRequest("O valor da transação deve ser maior que zero.");
            }

            // Padroniza o tipo para evitar problemas com letras maiúsculas/minúsculas
            string tipoNormalizado = transacao.Tipo.Trim().ToLower();

            if (tipoNormalizado != "despesa" && tipoNormalizado != "receita")
            {
                return BadRequest("O tipo de transação deve ser 'despesa' ou 'receita'.");
            }

            // Regra para que menores de idade só possam cadastrar despesas
            if (pessoa.Idade < 18 && tipoNormalizado == "receita")
            {
                return BadRequest("Usuários menores de 18 anos só podem ter despesas registradas.");
            }

            transacao.Tipo = tipoNormalizado; // Salvar de forma padronizada

            _context.Transacoes.Add(transacao);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(ListarTransacoes), new { id = transacao.Id }, transacao);
        }
    }
}