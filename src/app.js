const express = require("express");
const cors = require("cors");

const { uuid, isUuid } = require('uuidv4');

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];


function validateRepositoryId(request, response, next) {
  const { id } = request.params;

  if (!isUuid(id)) {
    return response.status(400).json({ error: 'invalid id'});
  }
  return next();
}

app.use("/repositories/:id", validateRepositoryId);

app.get("/repositories", (request, response) => {
  return response.json(repositories)
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body;

  const repository = {
    id: uuid(),
    title: title,
    url: url,
    techs: techs,
    likes: 0
  }

  repositories.push(repository);

  return response.json(repository);
});

app.put("/repositories/:id", (request, response) => {
  const { id } = request.params;
  const { title, url, techs } = request.body;

  const result = repositories.findIndex((repositorie) => repositorie.id === id );
  if (result < 0) {
    return response.status(400).json({ error: 'repository is not found'})
  }
  const repository = {
    id: id,
    title: title,
    url: url,
    techs: techs,
    likes: repositories[result].likes
  }

  repositories[result] = repository;

  return response.json(repository);
});

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params;
  const result = repositories.findIndex((repositorie) => repositorie.id === id );
  repositories.splice(result, 1);
  return response.status(204).json({ message: 'Repository deleted with success'});
});

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params;
  const result = repositories.findIndex((repositorie) => repositorie.id === id );
  repositories[result].likes += 1; 

  return response.json(repositories[result])
});

module.exports = app;
