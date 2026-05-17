import "dotenv/config";
import Parishe from "./src/Models/Parishes.js";
import conn from "./src/Config/db.js";

async function runSeed() {
  try {
    await conn.sync();

    await Parishe.bulkCreate([
      {
        name: "Nossa Senhora da Imaculada Conceição",
        city: "Cascavel",
        diocese: "Fortaleza",
        parishe_access_code: "ns123",
      },
      {
        name: "São José",
        city: "Cascavel",
        diocese: "Fortaleza",
        parishe_access_code: "sj123",
      },
    ]);
    console.log("✅ Dados inseridos com sucesso!");
    process.exit();
    return;
  } catch (error) {
    console.error("❌ Erro ao rodar a seed:", error);
    process.exit(1);
  }
}

runSeed();
