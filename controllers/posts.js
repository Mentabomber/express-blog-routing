const postsList = require("../db/db.json");
const fs = require("fs");
const path = require("path");


function index(req, res) {
    res.format({
        html: () => {
            const html = [`
                <h1>I Miei Posts</h1>
            `];
            html.push("<ul>");
            for( const post of postsList){
                html.push(`<li>
                    <h3>${post.title}</h3><br><br>`
                );
                html.push("</li>");
            }
            html.push("<ul>");
            res.send(html.join(""));
        },
        json: () => {
            res.type("json").send({
              totalElements: postsList.length,
              list: postsList
            });
        }
    });
   
}

function show(req, res){
    const post = findOrFail(req, res);
    res.json(post);
}

function create(req, res){
    res.format({
        html: () => {
            const html = [`
                <h1>Creazione nuovo post</h1>
            `];
            res.send(html.join(""));
        },
    })
    res.status(406).send(`Wrong request`);
}

function download(req, res){
    const post = findOrFail(req, res);

    const filePath = path.resolve(
        __dirname,
        "..",
        "public",
        "assets",
        "imgs",
        "posts",
        post.image
      );

    res.download(filePath);
    // res.status(406).send(`Wrong request`);
}


function findOrFail(req, res) {
    // recupero l'id dalla richiesta
    const postSlug = req.params.slug;
  
    // recupero la pizza dal menu
    const post = postsList.find((post) => post.slug == postSlug);
  
    // Nel caso in cui non sia stata trovata la pizza ritorno un 404
    if (!post) {
      res.status(404).send(`Il post con slug ${postSlug} non è stato trovato`);
      return; // interrompo l'esecuzione della funzione
    }
  
    return post;
  }

module.exports = {
index,
show,
create,
download
}