"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const express_1 = require("express");
const app_module_1 = require("./app.module");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.use((0, express_1.json)({ limit: '20mb' }));
    app.use((0, express_1.urlencoded)({ extended: true, limit: '20mb' }));
    app.enableCors();
    const port = process.env.PORT ?? 3003;
    await app.listen(port);
    console.log(`📄 Document Service running on: http://localhost:${port}`);
}
bootstrap();
//# sourceMappingURL=main.js.map