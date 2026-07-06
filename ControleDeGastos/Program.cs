using Microsoft.EntityFrameworkCore;
using ControleDeGastos.Data;

var builder = WebApplication.CreateBuilder(args);

// Configura a conexão com o Banco de Dados SQLite, criando o arquivo gastos.db
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlite("Data Source=gastos.db"));

// Ativa o mecanismo de Controllers
builder.Services.AddControllers();

// Configura o CORS para permitir que o Front-end faça requisições para esta API
builder.Services.AddCors(options =>
{
    options.AddPolicy("PermitirReact", policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyMethod()
              .AllowAnyHeader();
    });
});

var app = builder.Build();

// Seção para garantir que as tabelas serão criadas no Docker
using (var scope = app.Services.CreateScope())
{
    var context = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    context.Database.EnsureCreated(); // Cria o arquivo e todas as tabelas automaticamente se não existirem
}

// Ativa a política de segurança do CORS
app.UseCors("PermitirReact");

app.UseAuthorization();

// Mapeia os endpoints dos controllers automaticamente
app.MapControllers();

app.Run();