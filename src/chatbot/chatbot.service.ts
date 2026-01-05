import { Injectable, HttpException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

@Injectable()
export class ChatbotService {
    private apiKey: string;
    private apiUrl = 'https://api.openai.com/v1/chat/completions';

    constructor(private configService: ConfigService) {
        this.apiKey = this.configService.get<string>('OPENAI_API_KEY') || '';
    }

    async getResponse(message: string) {
        if (!this.apiKey) {
            return "Lo siento, mi cerebro (API Key) no está configurado.";
        }

        try {
            const response = await axios.post(
                this.apiUrl,
                {
                    model: "gpt-3.5-turbo",
                    messages: [
                        {
                            role: "system",
                            content: `Eres el asistente virtual experto de Riwi (TalentRidge).
                            
                            TUS CONOCIMIENTOS CLAVE (Úsalos para responder):
                            1. CV & PERFIL: Incluir proyectos relevantes, tecnologías dominadas y enlaces a GitHub. Sección de habilidades clara.
                            2. ENTREVISTAS TÉCNICAS: Practicar algoritmos (LeetCode, HackerRank), patrones de diseño y explicar razonamiento paso a paso.
                            3. GITHUB & PORTAFOLIO: Proyectos públicos, bien documentados (README.md con instalación/uso), commits frecuentes. Resolver problemas reales.
                            4. SOFT SKILLS: Comunicación clara/precisa, escucha activa, trabajo en equipo, empatía y resolución de problemas.
                            5. ROLES:
                               - Backend: JS(Node), Python, Java, SQL/NoSQL, APIs, Git.
                               - Full Stack: Frontend + Backend + BD.
                            6. VACANTES: Para aplicar, ir a "Vacantes Disponibles" en la plataforma. Si no hay experiencia, resaltar proyectos personales y actitud.
                            
                            TONO: Profesional, motivador, educativo y amigable. Usa emojis.
                            Si te preguntan algo fuera de esto, responde con tu conocimiento general de tecnología pero mantén el enfoque en la empleabilidad tech.`
                        },
                        { role: "user", content: message }
                    ],
                    max_tokens: 150
                },
                {
                    headers: {
                        'Authorization': `Bearer ${this.apiKey}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            return response.data.choices[0].message.content;
        } catch (error) {
            console.error('OpenAI Error:', error.response?.data || error.message);
            throw new HttpException('Error connecting to AI', 500);
        }
    }
}
