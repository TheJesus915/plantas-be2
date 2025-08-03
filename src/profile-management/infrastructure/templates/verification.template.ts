export class VerificationTemplate {

    static generateEmailChange(name: string, token: string): string {
        return `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h1 style="color: #2E7D32; text-align: center;">Cambio de Correo Electrónico</h1>
                <div style="background-color: #F1F8E9; padding: 20px; border-radius: 8px; text-align: center; border: 1px solid #C8E6C9;">
                    <p style="font-size: 16px; color: #33691E;">Hola ${name}! Has solicitado cambiar tu dirección de correo electrónico.</p>
                    <p style="font-size: 16px; color: #33691E;">Para verificar este nuevo correo electrónico, ingresa el siguiente código:</p>
                    <h2 style="color: #1B5E20; font-size: 36px; letter-spacing: 8px; margin: 25px 0; background-color: #DCEDC8; padding: 15px; border-radius: 4px;">${token}</h2>
                    <p style="color: #558B2F; font-size: 14px;">Este código expirará en 15 minutos.</p>
                </div>
                <p style="color: #666; text-align: center; margin-top: 20px; font-size: 13px;">
                    Si no solicitaste este cambio, ignora este correo electrónico y contacta con soporte.
                </p>
                <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #E8F5E9;">
                    <p style="color: #7CB342; font-size: 12px;">© ${new Date().getFullYear()} Jardín Digital. All rights reserved.</p>
                </div>
            </div>
        `;
    }
}