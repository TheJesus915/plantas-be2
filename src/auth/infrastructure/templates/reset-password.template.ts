export class ResetPasswordTemplate {
    static generate(name: string, code: string): string {
        return `
            <!DOCTYPE html>
            <html lang="es">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Restablecer Contraseña</title>
            </head>
            <body style="margin: 0; padding: 0; background-color: #f8fafc; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
                <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
                    
                    <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 20px; text-align: center;">
                        <div style="background-color: #ffffff; width: 60px; height: 60px; border-radius: 50%; margin: 0 auto 20px; display: flex; align-items: center; justify-content: center; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
                            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#667eea" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                                <circle cx="12" cy="16" r="1"></circle>
                                <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                            </svg>
                        </div>
                        <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 600; letter-spacing: -0.5px;">Restablecer Contraseña</h1>
                        <p style="color: rgba(255, 255, 255, 0.9); margin: 8px 0 0; font-size: 16px; font-weight: 400;">Jardín Digital</p>
                    </div>
                    
                    <!-- Content -->
                    <div style="padding: 40px 30px;">
                        <div style="text-align: center; margin-bottom: 30px;">
                            <h2 style="color: #1f2937; margin: 0 0 16px; font-size: 24px; font-weight: 600;">Hola, ${code}!</h2>
                            <p style="color: #6b7280; margin: 0; font-size: 16px; line-height: 1.6;">
                                Recibimos una solicitud para restablecer la contraseña de tu cuenta.
                                Utiliza el código de verificación a continuación:
                            </p>
                        </div>
                        
                        <!-- Verification Code -->
                        <div style="background: linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%); border: 2px dashed #d1d5db; border-radius: 12px; padding: 30px; text-align: center; margin: 30px 0;">
                            <p style="color: #6b7280; margin: 0 0 16px; font-size: 14px; font-weight: 500; text-transform: uppercase; letter-spacing: 1px;">
                                Código de Verificación
                            </p>
                            <div style="background-color: #ffffff; border-radius: 8px; padding: 20px; box-shadow: 0 2px 4px rgba(0,0,0,0.05); display: inline-block; min-width: 200px;">
                                <span style="color: #1f2937; font-size: 32px; font-weight: 700; letter-spacing: 4px; font-family: 'Courier New', monospace;">
                                    ${name}
                                </span>
                            </div>
                        </div>
                        
                        <!-- Instructions -->
                        <div style="background-color: #fef3c7; border-left: 4px solid #f59e0b; padding: 16px 20px; border-radius: 0 8px 8px 0; margin: 30px 0;">
                            <div style="display: flex; align-items: flex-start;">
                                <div style="flex-shrink: 0; margin-right: 12px;">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                        <circle cx="12" cy="12" r="10"></circle>
                                        <line x1="12" y1="8" x2="12" y2="12"></line>
                                        <line x1="12" y1="16" x2="12.01" y2="16"></line>
                                    </svg>
                                </div>
                                <div>
                                    <p style="color: #92400e; margin: 0; font-size: 14px; font-weight: 500;">
                                        <strong>Importante:</strong> Este código expirará en <strong>15 minutos</strong> por seguridad.
                                    </p>
                                </div>
                            </div>
                        </div>
    
                        <div style="text-align: center; margin-top: 40px;">
                            <p style="color: #9ca3af; font-size: 14px; line-height: 1.5; margin: 0;">
                                Si no solicitaste este código, puedes ignorar este correo de forma segura.<br>
                                Tu cuenta permanecerá protegida.
                            </p>
                        </div>
                    </div>
                    
                    <!-- Footer -->
                    <div style="background-color: #f9fafb; padding: 30px; text-align: center; border-top: 1px solid #e5e7eb;">
                        <div style="margin-bottom: 20px;">
                            <p style="color: #6b7280; font-size: 14px; margin: 0 0 8px; font-weight: 500;">
                                ¿Necesitas ayuda?
                            </p>
                            <p style="color: #9ca3af; font-size: 13px; margin: 0;">
                                Contáctanos en <a href="mailto:soporte@jardindigital.com" style="color: #667eea; text-decoration: none;">soporte@jardindigital.com</a>
                            </p>
                        </div>
                        
                        <div style="border-top: 1px solid #e5e7eb; padding-top: 20px;">
                            <p style="color: #9ca3af; font-size: 12px; margin: 0;">
                                © ${new Date().getFullYear()} Jardín Digital. Todos los derechos reservados.
                            </p>
                            <p style="color: #d1d5db; font-size: 11px; margin: 8px 0 0;">
                                Este es un correo electrónico automático, por favor no responder.
                            </p>
                        </div>
                    </div>
                    
                </div>
                
                <!-- Responsive styles for mobile -->
                <style>
                    @media only screen and (max-width: 600px) {
                        .container {
                            padding: 20px !important;
                        }
                        .header {
                            padding: 30px 20px !important;
                        }
                        .content {
                            padding: 30px 20px !important;
                        }
                        .code-container {
                            padding: 20px !important;
                        }
                        .verification-code {
                            font-size: 28px !important;
                            letter-spacing: 3px !important;
                        }
                    }
                </style>
            </body>
            </html>
        `;
    }
}