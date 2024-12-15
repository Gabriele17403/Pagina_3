async function connectToSerialPort() {
    try {
        // Chiedi all'utente di selezionare una porta seriale
        const port = await navigator.serial.requestPort();

        // Apri la porta seriale con la velocità di baud di Arduino (es. 9600)
        await port.open({ baudRate: 9600 });

        // Crea un lettore per la comunicazione seriale
        const reader = port.readable.getReader();

        // Esegui il loop di lettura dei dati dalla seriale
        while (true) {
            const { value, done } = await reader.read();

            // Se la lettura è terminata, esci
            if (done) break;

            // Converti il valore in un numero (assumiamo che Arduino invii il numero in formato stringa)
            const valueFromArduino = parseInt(value, 10); // Assicurati che i dati siano numerici

            // Se il valore letto è valido (tra 0 e 1000)
            if (!isNaN(valueFromArduino) && valueFromArduino >= 0 && valueFromArduino <= 1000) {
                // Mappa il valore tra 0 e 1000 a un angolo di rotazione tra 0 e 360 gradi
                const rotationDegree = (valueFromArduino / 1000) * 360;
                rotateWheel(rotationDegree); // Funzione che aggiorna la rotazione
            }
        }
    } catch (err) {
        console.error("Errore nella connessione alla porta seriale: ", err);
    }
}

// Funzione per aggiornare la rotazione della rotella
function rotateWheel(rotationDegree) {
    const rotella = document.getElementById('rotella');
    rotella.style.transform = `rotate(${rotationDegree}deg)`;
}

// Funzione per avviare la lettura dei dati
connectToSerialPort();
