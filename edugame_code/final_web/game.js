const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const ejs = require('ejs');

const app = express();
app.use(bodyParser.json());
app.set('view engine', 'ejs');

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'edugame'
});

connection.connect((err) => {
    if (err) throw err;
    console.log('Connected to MySQL Server!');
});

app.get('/', (req, res) => {
    res.render('index');
});

app.get('/games', (req, res) => {
    connection.query('SELECT * FROM game', (err, rows) => {
        if(err) throw err;
        console.log('Data received from Db:');
        console.log(rows);
        res.render('games', { games: rows });
    });
});

app.get('/categories', (req, res) => {
    connection.query('SELECT * FROM category', (err, rows) => {
        if(err) throw err;
        console.log('Data received from Db:');
        console.log(rows);
        res.render('categories', { categories: rows });
    });
});

app.get('/publishers', (req, res) => {
    const publisherQuery = 'SELECT * FROM publisher';
  
    connection.query(publisherQuery, (err, publisherRows) => {
      if (err) {
        console.log('Error in publishers query:', err);
        res.status(500).send('Internal server error');
        return;
      }
  
      console.log('Publishers data received from DB:');
      console.log(publisherRows);
  
      res.render('publishers', { publishers: publisherRows });
    });
  });
  
  app.get('/publishers/:id', (req, res) => {
    const publisherId = req.params.id;
    const publisherQuery = 'SELECT * FROM publisher WHERE publisher_id = ?';
    const gamesQuery = `
        SELECT g.game_id, g.title, g.age_group, g.description, g.min_players, g.max_players, g.game_url,
        COALESCE((SELECT AVG(rate_num) FROM member_rate_game WHERE game_id = g.game_id), 'Not rated') AS average_rating,
        phg.date_of_published, c.category_id, c.nametag
        FROM game g
        JOIN publisher_has_game phg ON g.game_id = phg.game_id
        JOIN game_has_category ghc ON g.game_id = ghc.game_id
        JOIN category c ON ghc.category_id = c.category_id
        WHERE phg.publisher_id = ?
    `;

    connection.query(publisherQuery, [publisherId], (err, publisherRows) => {
        if (err) {
            console.log('Error in publisher query:', err);
            res.status(500).send('Internal server error');
            return;
        }
        if (publisherRows.length === 0) {
            res.status(404).send('Publisher not found');
            return;
        }

        console.log('Publisher data received from DB:');
        console.log(publisherRows);

        const publisher = publisherRows[0];

        connection.query(gamesQuery, [publisherId], (err, gamesRows) => {
            if (err) {
                console.log('Error in games query:', err);
                res.status(500).send('Internal server error');
                return;
            }

            console.log('Games data received from DB:');
            console.log(gamesRows);

            res.render('publisher', { publisher: publisher, games: gamesRows });
        });
    });
});

  

app.get('/categories/:id', (req, res) => {
    const id = req.params.id;
    const query = `
        SELECT g.*
        FROM game g
        JOIN game_has_category ghc ON g.game_id = ghc.game_id
        WHERE ghc.category_id = ?
    `;
    connection.query(query, [id], (err, rows) => {
        if(err) {
            console.log('Error in query:', err);
            res.status(500).send('Internal server error');
            return;
        }
        console.log('Data received from Db:');
        console.log(rows);
        res.render('games', { games: rows });
    });
});

app.get('/games/:id', (req, res) => {
    const id = req.params.id;
    const gameQuery = `
    SELECT g.game_id, g.title, g.age_group, g.description, g.min_players, g.max_players, g.game_url,g.publisher_id,
    COALESCE((SELECT AVG(rate_num) FROM member_rate_game WHERE game_id = g.game_id), 'Not rated') AS average_rating,
    phg.date_of_published, p.name AS publisher_name,
    c.category_id, c.nametag,
    gi.image_id, gi.image_url
    FROM game g
    JOIN publisher_has_game phg ON g.game_id = phg.game_id
    JOIN publisher p ON phg.publisher_id = p.publisher_id
    JOIN game_has_category ghc ON g.game_id = ghc.game_id
    JOIN category c ON ghc.category_id = c.category_id
    JOIN game_has_image ghi ON g.game_id = ghi.game_id
    JOIN image gi ON ghi.image_id = gi.image_id
    WHERE g.game_id = ?
    `;

    connection.query(gameQuery, [id], (err, rows) => {
        if (err) {
            console.log('Error in game query:', err);
            res.status(500).send('Internal server error');
            return;
        }
        if (rows.length === 0) {
            res.status(404).send('Game not found');
            return;
        }

        console.log('Game data received from DB:');
        console.log(rows);

        const game = rows[0];
        const images = [];
        for (let i = 0; i < rows.length; i++) {
            images.push({
            image_id: rows[i].image_id,
            image_url: rows[i].image_url
        });}
        game.images = images;
        res.render('game', { game: game });
    });
});



app.get('/favorites', (req, res) => {
    const query = 'SELECT member_id FROM member';
    
    connection.query(query, (err, rows) => {
      if (err) {
        console.log('Error in query:', err);
        res.status(500).send('Internal server error');
        return;
      }
      
      console.log('Data received from DB:');
      console.log(rows);
      
      res.render('favorites', { members: rows });
    });
  });
  
  app.get('/favorites/:id', (req, res) => {
    const id = req.params.id;
    
    const query = `
      SELECT g.*
      FROM game g
      JOIN member_favorite_game mfg ON g.game_id = mfg.game_id
      WHERE mfg.member_id = ?
    `;
    
    connection.query(query, [id], (err, rows) => {
      if (err) {
        console.log('Error in query:', err);
        res.status(500).send('Internal server error');
        return;
      }
      
      console.log('Data received from DB:');
      console.log(rows);
      
      res.render('games', { games: rows });
    });
  });

app.listen(3000, () => {
    console.log('Server is running at port 3000');
});
