import { Test } from '@nestjs/testing';
import * as pactum from 'pactum';
import { AppModule } from '../src/app.module';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthDto } from 'src/auth/dto';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = await moduleRef.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
      }),
    );
    await app.init();
    await app.listen(3333);

    prisma = app.get(PrismaService);
    await prisma.cleanDb();
    pactum.request.setBaseUrl('http://localhost:3333');
  });

  afterAll(() => {
    app.close();
  });

  describe('Auth', () => {
    const body: AuthDto = { email: 'dib@gmail.com', password: '123' };

    describe('Signup', () => {
      const endpoint = '/auth/signup';

      it('should throw if email empty', () => {
        return pactum
          .spec()
          .post(endpoint)
          .withBody({ ...body, email: '' })
          .expectStatus(400);
      });

      it('should throw if password empty', () => {
        return pactum
          .spec()
          .post(endpoint)
          .withBody({ ...body, password: '' })
          .expectStatus(400);
      });

      it('should throw if no body', () => {
        return pactum.spec().post(endpoint).expectStatus(400);
      });

      it('should signup', () => {
        return pactum.spec().post(endpoint).withBody(body).expectStatus(201);
      });
    });

    describe('Signin', () => {
      const endpoint = '/auth/signin';

      it('should throw if email empty', () => {
        return pactum
          .spec()
          .post(endpoint)
          .withBody({ ...body, email: '' })
          .expectStatus(400);
      });

      it('should throw if password empty', () => {
        return pactum
          .spec()
          .post(endpoint)
          .withBody({ ...body, password: '' })
          .expectStatus(400);
      });

      it('should throw if no body', () => {
        return pactum.spec().post(endpoint).expectStatus(400);
      });

      it('should signin', () => {
        return pactum
          .spec()
          .post(endpoint)
          .withBody(body)
          .expectStatus(200)
          .stores('userAt', 'access_token');
      });
    });
  });

  describe('User', () => {
    describe('Get me', () => {
      it('should get current user', () => {
        return pactum
          .spec()
          .get('/users/me')
          .withBearerToken('$S{userAt}')
          .expectStatus(200);
      });
    });
    describe('Edit user', () => {});
  });

  describe('Bookmark', () => {
    describe('Create bookmark', () => {});
    describe('Get bookmarks', () => {});
    describe('Get bookmark by id', () => {});
    describe('Edit bookmark', () => {});
    describe('Delete bookmark', () => {});
  });
});
