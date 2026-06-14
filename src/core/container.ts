import { Container } from 'inversify';

import { AuthController } from '@/modules/auth/auth.controller';
import { AuthRouter } from '@/modules/auth/auth.router';
import { AuthService } from '@/modules/auth/auth.service';
import { FlashSaleController } from '@/modules/flashsale/flashsale.controller';
import { FlashSaleRouter } from '@/modules/flashsale/flashsale.router';
import { FlashSaleService } from '@/modules/flashsale/flashsale.service';
import { LeaderboardController } from '@/modules/leaderboard/leaderboard.controller';
import { LeaderboardQuery } from '@/modules/leaderboard/leaderboard.query';
import { LeaderboardRouter } from '@/modules/leaderboard/leaderboard.router';
import { LeaderboardService } from '@/modules/leaderboard/leaderboard.service';
import { ProductController } from '@/modules/product/product.controller';
import { ProductRouter } from '@/modules/product/product.router';
import { ProductService } from '@/modules/product/product.service';
import { UserController } from '@/modules/user/user.controller';
import { UserRouter } from '@/modules/user/user.router';
import { UserService } from '@/modules/user/user.service';

const container = new Container();

// Models
container.bind(LeaderboardQuery).toSelf().inSingletonScope();

// Services
container.bind(AuthService).toSelf().inSingletonScope();
container.bind(UserService).toSelf().inSingletonScope();
container.bind(ProductService).toSelf().inSingletonScope();
container.bind(FlashSaleService).toSelf().inSingletonScope();
container.bind(LeaderboardService).toSelf().inSingletonScope();

// Controllers
container.bind(AuthController).toSelf().inSingletonScope();
container.bind(UserController).toSelf().inSingletonScope();
container.bind(ProductController).toSelf().inSingletonScope();
container.bind(FlashSaleController).toSelf().inSingletonScope();
container.bind(LeaderboardController).toSelf().inSingletonScope();

// Routers
container.bind(AuthRouter).toSelf().inSingletonScope();
container.bind(UserRouter).toSelf().inSingletonScope();
container.bind(ProductRouter).toSelf().inSingletonScope();
container.bind(FlashSaleRouter).toSelf().inSingletonScope();
container.bind(LeaderboardRouter).toSelf().inSingletonScope();

export { container };
