const { Pool } = require('pg');
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

async function audit() {
  try {
    const users = await pool.query('SELECT COUNT(*) FROM "User"');
    const movies = await pool.query('SELECT COUNT(*) FROM "Movie"');
    const categories = await pool.query('SELECT COUNT(*) FROM "Category"');
    const favorites = await pool.query('SELECT COUNT(*) FROM "Favorite"');
    const history = await pool.query('SELECT COUNT(*) FROM "WatchHistory"');
    const purchases = await pool.query('SELECT COUNT(*) FROM "Purchase"');
    const donations = await pool.query('SELECT COUNT(*) FROM "Donation"');
    
    console.log(JSON.stringify({
      users: users.rows[0].count, 
      movies: movies.rows[0].count, 
      categories: categories.rows[0].count, 
      favorites: favorites.rows[0].count, 
      history: history.rows[0].count, 
      purchases: purchases.rows[0].count, 
      donations: donations.rows[0].count
    }));
  } catch (e) {
    console.error("DB_AUDIT_ERROR:", e.message);
  } finally {
    await pool.end();
  }
}
audit();
