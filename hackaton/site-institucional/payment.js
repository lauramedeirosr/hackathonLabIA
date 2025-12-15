async function gerarPIX() {

    const body = {
        transaction_amount: 29.00, 
        description: "Assinatura Mensal - Profissional Tech",
        payment_method_id: "pix",
        payer: {
            email: "cliente@email.com",
            first_name: "Nome",
            last_name: "Sobrenome"
        }
    };

    const response = await fetch("https://api.mercadopago.com/v1/payments", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer SEU_TOKEN_AQUI"
        },
        body: JSON.stringify(body)
    });

    const pagamento = await response.json();
    
    // QR CODE
    document.getElementById("qrcode").src = pagamento.point_of_interaction.transaction_data.qr_code_base64;

    // CÓPIA E COLA
    document.getElementById("copia_cola").innerText =
        pagamento.point_of_interaction.transaction_data.qr_code;

    // ID DO PAGAMENTO
    window.pagamentoID = pagamento.id;

    verificarPagamento();
}

async function verificarPagamento() {
    setInterval(async () => {
        const response = await fetch(
            `https://api.mercadopago.com/v1/payments/${window.pagamentoID}`,
            {
                headers: {
                    "Authorization": "Bearer SEU_TOKEN_AQUI"
                }
            }
        );

        const status = await response.json();

        if (status.status === "approved") {
            alert("Pagamento aprovado! Acesso liberado.");
            window.location.href = "../site-plataforma/dashboard.html";
        }
    }, 4000);
}
