const { exec } = require("child_process");

const data = JSON.stringify({
    phone: "3339876543",
    city: "Roma",
    homeValue: 180000,
    mortgageAmount: 120000,
    holders: [
        {
            type: "first",
            firstName: "Giulia",
            lastName: "Verdi",
            email: "giulia@verdi.it",
            dataNascita: "1990-02-10",
            redditoMensile: 2800,
            mensilita: 12,
        },
    ],
});



// Esempio di richiesta curl GET
const url = "http://localhost:3000/api/lead";

const curlCommand = `curl -X POST "${url}" -H "Content-Type: application/json" -d '${data}'`;

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


// curl -X POST http://localhost:3000/api/lead \
//   -H "Content-Type: application/json" \
//   -d '{
//     "phoneNumber": "+393481234567",
//     "mortgageAmount": 150000.00,
//     "homeValue": 250000.00,
//     "city": "Milano",
//     "holders": [
//       {
//         "type": "first",
//         "firstName": "Sara",
//         "lastName": "Bianchi",
//         "email": "sara@bianchi.it",
//         "dateOfBirth": "1990-08-12",
//         "monthlyIncome": 3200,
//         "incomeBreakdown": 13
//       }
//     ]
//   }'