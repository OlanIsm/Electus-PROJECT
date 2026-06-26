import {
  Controller,
  Get,
  Put,
  Body,
  UseGuards,
  Req,
  UseInterceptors,
  UploadedFile,
  NotFoundException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import * as bcrypt from 'bcryptjs';

@Controller('user')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('profile')
  async getProfile(@Req() req) {
    const user = await this.usersService.findById(req.user.userId);
    if (!user) throw new NotFoundException('User not found');
    // Exclude password from response
    const { password, createdAt, ...result } = user;
    return result;
  }

  @Put('profile')
  @UseInterceptors(
    FileInterceptor('avatar', {
      storage: diskStorage({
        destination: './uploads/avatars',
        filename: (req, file, cb) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(null, `${uniqueSuffix}${extname(file.originalname)}`);
        },
      }),
    }),
  )
  async updateProfile(
    @Req() req,
    @Body() body: any,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    const updateData: any = {};
    if (body.fullName) updateData.fullName = body.fullName;
    if (body.email) updateData.email = body.email;
    if (body.password) {
      updateData.password = await bcrypt.hash(body.password, 10);
    }
    if (file) {
      // Assuming we will serve the /uploads directory statically under /uploads path
      // e.g. http://server.com/uploads/avatars/...
      // A more robust app might use env variable for base url
      updateData.avatarUrl = `/uploads/avatars/${file.filename}`;
    }

    const user = await this.usersService.updateProfile(req.user.userId, updateData);
    if (!user) throw new NotFoundException('User not found');
    const { password, createdAt, ...result } = user;
    return result;
  }

  @Put('culture-fit')
  async updateCultureFit(@Req() req, @Body() body: any) {
    const user = await this.usersService.updateCultureFit(req.user.userId, body);
    if (!user) throw new NotFoundException('User not found');
    return user.riasecTarget;
  }
}
