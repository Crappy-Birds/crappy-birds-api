import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";


@Entity("wallet_discord")
export default class WalletDiscord {
    @PrimaryGeneratedColumn({ type: "int", name: "id" })
    id: number;

    @Column("varchar", { length: 255, name: 'wallet_address', default: '' })
    walletAddress: string | null

    @Column("varchar", { length: 255, name: 'discord_address', default: '' })
    discordAddress: string | null

    @Column("timestamp", {
        name: "created_at",
        nullable: true,
        default: () => "CURRENT_TIMESTAMP",
        select: false
    })
    createdAt: Date | null;

    @Column("timestamp", {
        name: "updated_at",
        nullable: true,
        default: () => "CURRENT_TIMESTAMP",
        select: false

    })
    updatedAt: Date | null;
}