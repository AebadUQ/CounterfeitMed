document.addEventListener("DOMContentLoaded", async function() {
    let web3;
    let counterfeitMedContract;
    const contractAddress = '0xa82ff9afd8f496c3d6ac40e2a0f282e47488cfc9'; // Your contract address
    const abi = [  ]; 

    // Connect to MetaMask
    async function connectWallet() {
        if (window.ethereum) {
            try {
                await window.ethereum.request({ method: 'eth_requestAccounts' });
                web3 = new Web3(window.ethereum);
                counterfeitMedContract = new web3.eth.Contract(abi, contractAddress);
                console.log('Wallet connected');
            } catch (error) {
                console.error('User denied account access', error);
            }
        } else {
            alert('Non-Ethereum browser detected. You should consider trying MetaMask!');
        }
    }

    document.getElementById('connectWallet').addEventListener('click', connectWallet);

    function onScanSuccess(qrCodeMessage) {
        const medicineDetails = JSON.parse(qrCodeMessage);
        fetchMedicineDetails(medicineDetails.hash);
    }

    function onScanError(errorMessage) {
        console.error(errorMessage);
    }

    async function fetchMedicineDetails(medicineHash) {
        try {
            const medicine = await counterfeitMedContract.methods.medicines(medicineHash).call();
            displayMedicineDetails(medicine);
        } catch (error) {
            console.error('Error fetching medicine details', error);
        }
    }

    function displayMedicineDetails(medicine) {
        const resultElement = document.getElementById('result');
        resultElement.innerHTML = `
            <h2>Medicine Details</h2>
            <p><strong>Name:</strong> ${medicine.name}</p>
            <p><strong>Manufacturer ID:</strong> ${medicine.manufacturerId}</p>
            <p><strong>Dosage Form:</strong> ${medicine.dosageForm}</p>
            <p><strong>Batch ID:</strong> ${medicine.batchId}</p>
            <p><strong>Ingredients:</strong> ${medicine.ingredients.join(', ')}</p>
            <p><strong>Expiry Date:</strong> ${new Date(parseInt(medicine.expiryDate) * 1000).toLocaleDateString()}</p>
            <p><strong>Price:</strong> ${medicine.price}</p>
            <p><strong>Description:</strong> ${medicine.description}</p>
            <p><strong>Hash:</strong> ${medicine.hash}</p>
        `;
    }

    const html5QrCode = new Html5Qrcode("reader");

    html5QrCode.start(
        { facingMode: "environment" },
        {
            fps: 10,
            qrbox: 250
        },
        onScanSuccess,
        onScanError
    ).catch(err => {
        console.error(err);
    });
});
