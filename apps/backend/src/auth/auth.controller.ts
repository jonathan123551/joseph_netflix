import {
  Controller,
  Post,
  Body,
  Req,
  Res,
  HttpCode,
  HttpStatus,
  UseGuards,
  Get,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import type { Request, Response } from 'express';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { CurrentUser } from './decorators/user.decorator';
import { ApiTags, ApiOperation, ApiResponse, ApiCookieAuth } from '@nestjs/swagger';
import { ThrottlerGuard } from '@nestjs/throttler';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  private cookieBaseOptions() {
    const isProduction = process.env.NODE_ENV === 'production';
    // Frontend and backend are served from separate *.up.railway.app subdomains,
    // which the public suffix list treats as cross-site. Cross-site cookies must
    // use SameSite=None; Secure so the browser sends them on frontend->backend
    // requests. Locally (http://localhost) Secure cookies can't be set, so fall
    // back to Lax without Secure.
    return {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? ('none' as const) : ('lax' as const),
    };
  }

  private setCookies(res: Response, accessToken: string, refreshToken: string) {
    const base = this.cookieBaseOptions();
    res.cookie('accessToken', accessToken, {
      ...base,
      maxAge: 15 * 60 * 1000, // 15 minutes
    });
    res.cookie('refreshToken', refreshToken, {
      ...base,
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });
  }

  private clearAuthCookies(res: Response) {
    const base = this.cookieBaseOptions();
    res.clearCookie('accessToken', base);
    res.clearCookie('refreshToken', base);
  }

  @UseGuards(ThrottlerGuard)
  @Post('register')
  @ApiOperation({ summary: 'Register a new user' })
  @ApiResponse({ status: 201, description: 'User successfully registered.' })
  @ApiResponse({ status: 409, description: 'Email already exists.' })
  async register(
    @Body() dto: RegisterDto,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const ipAddress = req.ip;
    const deviceInfo = req.headers['user-agent'];
    const result = await this.authService.register(dto, ipAddress, deviceInfo);
    this.setCookies(res, result.accessToken, result.refreshToken);
    return { user: result.user };
  }

  @UseGuards(ThrottlerGuard)
  @HttpCode(HttpStatus.OK)
  @Post('login')
  @ApiOperation({ summary: 'Login user' })
  @ApiResponse({ status: 200, description: 'User successfully logged in.' })
  @ApiResponse({ status: 401, description: 'Invalid credentials.' })
  async login(
    @Body() dto: LoginDto,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const ipAddress = req.ip;
    const deviceInfo = req.headers['user-agent'];
    const result = await this.authService.login(dto, ipAddress, deviceInfo);
    this.setCookies(res, result.accessToken, result.refreshToken);
    return { user: result.user };
  }

  @HttpCode(HttpStatus.OK)
  @Post('refresh')
  @ApiOperation({ summary: 'Refresh access token' })
  @ApiResponse({ status: 200, description: 'Tokens successfully refreshed.' })
  @ApiResponse({ status: 401, description: 'Invalid refresh token.' })
  async refresh(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const oldRefreshToken = req.cookies?.refreshToken;
    if (!oldRefreshToken) {
      res.status(HttpStatus.UNAUTHORIZED).send({ message: 'No refresh token provided' });
      return;
    }
    const ipAddress = req.ip;
    const deviceInfo = req.headers['user-agent'];
    const result = await this.authService.refreshTokens(
      oldRefreshToken,
      ipAddress,
      deviceInfo,
    );
    this.setCookies(res, result.accessToken, result.refreshToken);
    return { user: result.user };
  }

  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @Post('logout')
  @ApiCookieAuth()
  @ApiOperation({ summary: 'Logout current device' })
  @ApiResponse({ status: 200, description: 'User successfully logged out.' })
  async logout(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const refreshToken = req.cookies?.refreshToken;
    await this.authService.logout(refreshToken);
    this.clearAuthCookies(res);
    return { message: 'Logged out successfully' };
  }

  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @Post('logout-all')
  @ApiCookieAuth()
  @ApiOperation({ summary: 'Logout all devices' })
  @ApiResponse({ status: 200, description: 'User successfully logged out from all devices.' })
  async logoutAll(
    @CurrentUser() user: any,
    @Res({ passthrough: true }) res: Response,
  ) {
    await this.authService.logoutAll(user.sub);
    this.clearAuthCookies(res);
    return { message: 'Logged out from all devices successfully' };
  }
  
  @UseGuards(JwtAuthGuard)
  @Get('me')
  @ApiCookieAuth()
  @ApiOperation({ summary: 'Get current user profile' })
  getProfile(@CurrentUser() user: any) {
    return user;
  }
}
