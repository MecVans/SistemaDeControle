using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace ControleDeGastos.Modelos
{
    /// Representa a classe "Pessoa" no projeto.
    public class Pessoa
    {
        [Key] // Seção que gera o ID aleatório da pessoa (Chave primária no banco)
        [DatabaseGenerated(DatabaseGeneratedOption.None)] // Impede o banco de tentar criar um ID sequencial
        public int Id { get; set; } = new Random().Next(100000, 999999); // Filtro para que o ID tenha 6 dígitos

        [Required] // Campos "Required" são os obrigatórios no sistema
        public string Nome { get; set; } = string.Empty;

        [Required]
        [Range(0, 150)] // Filtro para que a idade válida seja entre 0 e 150
        public int Idade { get; set; }

        [JsonIgnore] // Impede loops infinitos na hora do .NET converter o objeto para JSON.
        public List<Transacao> Transacoes { get; set; } = new List<Transacao>();
    }
}