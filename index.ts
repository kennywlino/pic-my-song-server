import 'dotenv/config';
import { start } from './src/server';

const PORT: number = parseInt(<string>process.env.PORT, 10) || 3004;

start(PORT);