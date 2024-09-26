import { Body, Controller, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiExtraModels, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ApiResponseType } from '@infrastructure/common/swagger.decorator';
import { BearerTokenPresenter, UserPresenter } from '@adapters/presenters/user.presenter';
import { AuthCrendentialsDto } from '@usecases/users/users.dto';
import { AuthUsecase } from '@usecases/users/users.usecase';
import { User, BearerToken } from '@domain/models/user.interface';
import { AuthControllerAdapter} from '@adapters/controllers/auth.controller';

@Controller('auth')
@ApiTags('Auth')
@ApiResponse({
  status: 401,
  description: 'No authorization token was found',
})
@ApiResponse({ status: 500, description: 'Internal error' })
@ApiExtraModels(User)
export class AuthController implements AuthControllerAdapter {
  constructor(
    private readonly AuthUsecase: AuthUsecase
  ) {}

  @Post('/signup')
  @ApiBody({
    type: AuthCrendentialsDto,
    description: 'Json structure for user object',
  })
  @ApiResponseType(UserPresenter, true)
  @ApiOperation({ description: 'signup' })
  @ApiResponse({ status: 200 })
  async signUp(@Body() authCrendentialsDto: AuthCrendentialsDto): Promise<User> {
    const user = await this.AuthUsecase.signUp(authCrendentialsDto);

    return new UserPresenter(user);
  }

  @Post('/signin')
  @ApiBearerAuth()
  @ApiBody({
    type: AuthCrendentialsDto,
    description: 'Json structure for user object',
  })
  @ApiOperation({ description: 'login' })
  @ApiResponse({ status: 200, type: BearerTokenPresenter, isArray: false })
  async signIn(@Body() authCrendentialsDto: AuthCrendentialsDto): Promise<BearerToken> {
    const accessToken = await this.AuthUsecase.signIn(authCrendentialsDto);

    return new BearerTokenPresenter(accessToken);
  }
}
