export class VerificationCodeTemplate {
    static generate(name: string, code: string): string {
        return `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <title>Verificación de cuenta - Jardín Digital</title>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    line-height: 1.6;
                    color: #333;
                    max-width: 600px;
                    margin: 0 auto;
                    padding: 20px;
                }
                .header {
                    background-color: #4CAF50;
                    color: white;
                    padding: 15px;
                    text-align: center;
                }
                .content {
                    padding: 20px;
                    background-color: #f9f9f9;
                    border-radius: 5px;
                }
                .verification-code {
                    font-size: 24px;
                    font-weight: bold;
                    text-align: center;
                    margin: 20px 0;
                    letter-spacing: 5px;
                    color: #4CAF50;
                }
                .footer {
                    text-align: center;
                    font-size: 12px;
                    color: #666;
                    margin-top: 20px;
                }
            </style>
        </head>
        <body>
            <div class="header">
                <h1>Jardín Digital</h1>
            </div>
            <div class="content">
                <h2>Verifica tu cuenta</h2>
                <p>Hola ${name},</p>
                <p>Gracias por registrarte en Jardín Digital. Para completar tu registro, necesitamos verificar tu dirección de correo electrónico. Por favor, utiliza el siguiente código de verificación:</p>
                
                <div class="verification-code">${code}</div>
                
                <p>Este código expirará en 15 minutos.</p>
                <p>Si no has solicitado esta verificación, puedes ignorar este correo electrónico.</p>
            </div>
            <div class="footer">
                <p>&copy; ${new Date().getFullYear()} Jardín Digital. Todos los derechos reservados.</p>
            </div>
        </body>
        </html>
        `;
    }
}

