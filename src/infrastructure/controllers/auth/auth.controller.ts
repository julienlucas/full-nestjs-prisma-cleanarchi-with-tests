import { Body, Controller, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiExtraModels, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthCrendentialsDto } from '@infrastructure/repositories/users/users.dto';
import { AuthUsecase } from '@domain/usecases/auth.usecase';
import { User } from '@domain/models/user.interface';
import { BearerTokenPresenter } from '@infrastructure/presenters/user.presenter';

@Controller('auth')
@ApiTags('Auth')
@ApiResponse({
  status: 401,
  description: 'No authorization token was found',
})
@ApiResponse({ status: 500, description: 'Internal error' })
@ApiExtraModels(User)
export class AuthController {
  constructor(
    private readonly AuthUsecase: AuthUsecase
  ) {}

  @Post('/signup')
  @ApiBody({
    type: AuthCrendentialsDto,
    description: 'Json structure for user object',
  })
  @ApiOperation({ description: 'signup' })
  @ApiResponse({ status: 200 })
  signUp(@Body() authCrendentialsDto: AuthCrendentialsDto): Promise<User> {
    return this.AuthUsecase.signUp(authCrendentialsDto);
  }

  @Post('/signin')
  @ApiBearerAuth()
  @ApiBody({
    type: AuthCrendentialsDto,
    description: 'Json structure for user object',
  })
  @ApiOperation({ description: 'login' })
  @ApiResponse({ status: 200, type: BearerTokenPresenter, isArray: false })
  signIn(@Body() authCrendentialsDto: AuthCrendentialsDto): Promise<{ accessToken: string }> {
    return this.AuthUsecase.signIn(authCrendentialsDto);
  }
}
