import { encoding_for_model } from "tiktoken";
import fs from "fs/promises";

// Función para contar tokens de un texto simple
async function contarTokens() {
    //1. Seleccionar el modelo 
    const modelo = "gpt-4";
    const encoding = encoding_for_model(modelo);
    //2. Ingresar el texto
    const texto = "Hola, ¿Cómo estás?";
    //3. Codificar el texto a tokens -> embebido
    const generado = encoding.encode(texto);
    console.log(generado);
    //4. Contar los tokens
    console.log("Número de tokens:", generado.length);
    //5. Calcular costos (Estimado) --> Tokens de Entrada
    const costo_por_1000_tokens_entrada = 0.03; //USD por 1000 tokens gpt4
    const costoFinal = (generado.length / 1000) * costo_por_1000_tokens_entrada;
    console.log("Costo estimado:", costoFinal, "USD");
}

function dividirEnChunks(texto, tamañoChunk) {
    const chunks = [];
    for (let i = 0; i < texto.length; i += tamañoChunk) {
        chunks.push(texto.slice(i, i + tamañoChunk));
    }
    return chunks;
}

async function procesarLibroConChunks() {
    try {

        const modelo = "gpt-4";
        const encoding = encoding_for_model(modelo);
        
        const textoCompleto = await fs.readFile("libro.txt", "utf-8");
        
        const tamañoChunk = 2000;
        const chunks = dividirEnChunks(textoCompleto, tamañoChunk);
        
        console.log(`Total de chunks creados: ${chunks.length}`);
        console.log(`Tamaño de cada chunk: ${tamañoChunk} caracteres\n`);
        
        let tokensTotales = 0;
        
        chunks.forEach((chunk, index) => {
            const tokens = encoding.encode(chunk);
            tokensTotales += tokens.length;
            
        });
        
        const costo_por_1000_tokens_entrada = 0.03; 
        const costo_por_1000_tokens_salida = 0.06;
        
        const costoEntrada = (tokensTotales / 1000) * costo_por_1000_tokens_entrada;
        
        console.log(`Total de tokens en el libro: ${tokensTotales.toLocaleString()}`);
        console.log(`Costo estimado de entrada: $${costoEntrada.toFixed(4)} USD`);
        console.log(`\nSi se genera una respuesta de similar tamaño:`);
        const costoSalida = (tokensTotales / 1000) * costo_por_1000_tokens_salida;
        const costoTotal = costoEntrada + costoSalida;
        console.log(`  Costo entrada: $${costoEntrada.toFixed(4)} USD`);
        console.log(`  Costo salida: $${costoSalida.toFixed(4)} USD`);
        console.log(`  Costo total: $${costoTotal.toFixed(4)} USD`);
        
        encoding.free();
        
    } catch (error) {
        console.error("Error al procesar el libro:", error.message);
    }
}

async function main() {
    await contarTokens();
    await procesarLibroConChunks();
}

main();