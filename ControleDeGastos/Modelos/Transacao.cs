using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ControleDeGastos.Modelos
{
    // Classe para representar as transações no projeto.
    public class Transacao
    {
        [Key]
        public Guid Id { get; set; } = Guid.NewGuid(); // Gerar ID automático

        [Required]
        public string Descricao { get; set; } = string.Empty;

        [Required]
        [Column(TypeName = "decimal(18,2)")] // Definindo decimal monetário para o banco
        public decimal Valor { get; set; }

        [Required]
        public string Tipo { get; set; } = "despesa"; // Definição do tipo de transação

        [Required]
        public int PessoaId { get; set; } // ID que se conecta a pessoa (chave estrangeira)

        [ForeignKey("PessoaId")] // Propriedade para relaciona Pessoa e Transação
        public Pessoa? Pessoa { get; set; }
    }
}