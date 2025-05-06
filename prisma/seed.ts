import { PrismaClient, UserRole } from '@prisma/client';
import { hash } from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  // Create default admin user if it doesn't exist
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@example.com';
  
  const existingAdmin = await prisma.user.findUnique({
    where: { email: adminEmail }
  });
  
  if (!existingAdmin) {
    const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';
    const hashedPassword = await hash(adminPassword, 12);
    
    await prisma.user.create({
      data: {
        email: adminEmail,
        name: 'Admin',
        hashedPassword,
        role: UserRole.ADMIN
      }
    });
    
    console.log(`Created admin user: ${adminEmail}`);
  }
  
  // Add default games
  const defaultGames = [
    { name: 'Orionstars', slug: 'orionstars' },
    { name: 'Fish Table', slug: 'fishtable' },
    { name: 'Lucky Tiger', slug: 'luckytiger' },
    { name: 'Golden Dragon', slug: 'goldendragon' }
  ];
  
  for (const game of defaultGames) {
    const existingGame = await prisma.game.findUnique({
      where: { slug: game.slug }
    });
    
    if (!existingGame) {
      await prisma.game.create({
        data: {
          name: game.name,
          slug: game.slug,
          active: true
        }
      });
      
      console.log(`Created game: ${game.name}`);
    }
  }
  
  // Default system configuration
  const configItems = [
    { key: 'btc_address', value: process.env.DEFAULT_BTC_ADDRESS || 'bc1q87665mq57xhw3rtz2drjnnu8eyv4sljmjx93ch' },
    { key: 'lightning_address', value: process.env.DEFAULT_LIGHTNING_ADDRESS || 'lnbc1500n1p0n...[shortened]...xphz6a' },
    { key: 'network_fee', value: process.env.NETWORK_FEE || '0.0001' }
  ];
  
  for (const item of configItems) {
    const existingConfig = await prisma.systemConfig.findUnique({
      where: { key: item.key }
    });
    
    if (!existingConfig) {
      await prisma.systemConfig.create({
        data: {
          key: item.key,
          value: item.value
        }
      });
      
      console.log(`Created config: ${item.key}`);
    }
  }
  
  console.log('Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });