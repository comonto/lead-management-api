// Esempio di richiesta curl GET
const url = 'https://jsonplaceholder.typicode.com/posts/1';

const curlCommand = `curl -X GET "${url}"`;

exec(curlCommand, (error, stdout, stderr) => {
  if (error) {
    console.error(`Errore durante l'esecuzione di curl: ${error.message}`);
    return;
  }

  if (stderr) {
    console.error(`stderr: ${stderr}`);
    return;
  }

  console.log(`Risposta curl:\n${stdout}`);
});