import readline from 'readline';
import gradient from 'gradient-string';
import { mailBomber } from './mailBomber.js';
import rl from './readlineInstance.js';

const consoleColors = {
    blue: ['#199cff', '#0600ba'], 
    green: ['#00ffee', '#00ff62'], 
    nitral: ['#c4e6ff', '#b3b1b1'], 
    red: ['#cf0808', '#630000'], 
    rainbow: ['#ff1f1f', '#ff9e1f', '#ffff1f', '#5ffa16', '#16fa5f', '#16fadc', '#16b9fa', '#1666fa', '#1a16fa', '#8116fa', '#d016fa', '#fa16cc'] 
};

function isValidMail(mail) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(mail);
}          
function isValidCount(count) {
    return typeof count === 'number' && count >= 1 && count <= 200;
}
function askMail(callback) {
    rl.question(gradient(consoleColors.nitral).multiline('\nВведите email получателя: '), (mail) => {
        if (isValidMail(mail)) {
            callback(mail); 
        } else {
            console.log(gradient(consoleColors.red).multiline('Ошибка: Некорректный email получателя!'));
            askMail(callback);
        }
    });
}
function askCount(mail) {
    rl.question(gradient(consoleColors.nitral).multiline('Введите количество (от 1 до 1000): '), (inputCount) => {
        const count = parseInt(inputCount, 10); 
        if (isValidCount(count)) {
            mailBomber(mail, count);
        } else {
            console.log(gradient(consoleColors.red).multiline('Ошибка: количество должно быть числом от 1 до 200.'));
            askCount(mail); 
        }
    });
}
export const mailStarter = () => {
    readline.cursorTo(process.stdout, 0, 0);
    readline.clearScreenDown(process.stdout);
    console.log(gradient(consoleColors.rainbow).multiline("\n     __  __ _    _      _      _   _   \n    |  \\/  (_)__| |_ _ (_)__ _| |_| |_\n    | |\\/| | / _` | ' \\| / _` | ' \\  _|\n    |_|  |_|_\\__,_|_||_|_\\__, |_||_\\__|\n                         |___/         \n     © EHD BY VARUJAN\n     VERSION 1.0.0 "));
    askMail((mail) => {
        askCount(mail);
    });
}