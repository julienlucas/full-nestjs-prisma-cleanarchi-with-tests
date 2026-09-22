import { Injectable } from "@nestjs/common";
import { PrismaClient } from "@prisma/client";

/**
 * Pas de $connect() dans onModuleInit.
 *
 * Prisma ouvre la connexion tout seul, paresseusement, à la première requête :
 * se connecter au démarrage n'apporte rien et, en serverless (Vercel), coûte un
 * aller-retour à chaque cold start.
 *
 * Surtout, ce $connect() faisait échouer le bootstrap complet de Nest quand la
 * base était injoignable : toute l'API tombait en 500, y compris Swagger et les
 * routes qui ne touchent pas la base. Sans lui, seules les routes qui
 * interrogent réellement la base échouent.
 */
@Injectable()
export class PrismaService extends PrismaClient {}
