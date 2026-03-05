// setupDb.js
const sql = require('mssql');

// Configuration de la connexion SQL Server
const config = {
  user: 'aspnet',
  password: 'aspasp',
  server: 'sql22-w22-cd.rd.talentsoft.com',
  database: 'OAR_TRMMASTER_PREPROD_RECRUITING',
  options: {
    encrypt: true, // nécessaire pour certaines instances
    trustServerCertificate: true // si certificat auto-signé
  }
};

// Requête à exécuter avant les tests
const query = `
UPDATE [TRM].[Assessor]
SET [Discriminator] = 'InternalAssessor'
WHERE UserId = 1; 
`;

async function runQuery() {
  try {
    // Connexion à la DB
    let pool = await sql.connect(config);
    let result = await pool.request().query(query);
    console.log('Requête exécutée avec succès :', result.rowsAffected);
    sql.close();
  } catch (err) {
    console.error('Erreur lors de l’exécution de la requête :', err);
    sql.close();
  }
}

// Exécute le script si lancé directement
runQuery();
