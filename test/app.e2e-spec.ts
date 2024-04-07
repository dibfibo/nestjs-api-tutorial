import { Test } from '@nestjs/testing';
import * as pactum from 'pactum';
import { AppModule } from '../src/app.module';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthDto } from 'src/auth/dto';
import { EditUserDto } from 'src/user/dto';
import { CreateBookmarkDto, EditBookmarkDto } from 'src/bookmark/dto';
import { inspect } from 'util';

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
        return pactum.spec().post(endpoint).withBody(body).inspect().expectStatus(201);
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
      
      it('should throw if password wrong', () => {
        return pactum
          .spec()
          .post(endpoint)
          .withBody({ ...body, password: Math.random().toString() })
          .expectStatus(403);
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
          .inspect()
          .stores('userAt', 'access_token');
      });
    });
  });

  const jwt = '$S{userAt}';

  describe('User', () => {
    const endpoint = '/users';
    describe('Get me', () => {
      it('should get current user', () => {
        return pactum
          .spec()
          .get(`${endpoint}/me`)
          .withBearerToken(jwt)
          .expectStatus(200);
      });
    });
    describe('Edit user', () => {
      it('should edit current user', () => {
        const body: EditUserDto = {
          firstName: 'dib',
        };

        return pactum
          .spec()
          .patch(endpoint)
          .withBearerToken(jwt)
          .withBody(body)
          .expectStatus(200);
      });
    });
  });

  describe('Bookmarks', () => {
    const endpoint = '/bookmarks';
    describe('Get empty bookmarks', () => {
      it('should get bookmarks', () => {
        return pactum
          .spec()
          .get(endpoint)
          .withBearerToken(jwt)
          .expectStatus(200)
          .expectBody([]);
      });
    });

    describe('Create bookmark', () => {
      const dto: CreateBookmarkDto = {
        title: 'First Bookmark',
        link: 'https://www.youtube.com/watch?v=d6WC5n9G_sM',
      };
      it('should create bookmark', () => {
        return pactum
          .spec()
          .post(endpoint)
          .withBearerToken(jwt)
          .withBody(dto)
          .expectStatus(201)
          .stores('bookmarkId', 'id');
      });
    });

    describe('Get bookmarks', () => {
      it('should get bookmarks', () => {
        return pactum
          .spec()
          .get(endpoint)
          .withBearerToken(jwt)
          .expectStatus(200)
          .expectJsonLength(1);
      });
    });

    describe('Get bookmark by id', () => {
      it('should get bookmark by id', () => {
        return pactum
          .spec()
          .get(`${endpoint}/{id}`)
          .withPathParams('id', '$S{bookmarkId}')
          .withBearerToken(jwt)
          .expectStatus(200)
          .expectBodyContains('$S{bookmarkId}'); //.expectJsonMatch({id: '$S{bookmarkId}'}) would have been the correct way of testing to prevent false positive matches with other numbers, user id etc.
      });
    });

    describe('Edit bookmark by id', () => {
      const dto: EditBookmarkDto = {
        title:
          'Kubernetes Course - Full Beginners Tutorial (Containerize Your Apps!)',
        description:
          'Learn how to use Kubernetes in this complete course. Kubernetes makes it possible to containerize applications and simplifies app deployment to production.',
      };
      it('should edit bookmark', () => {
        return pactum
          .spec()
          .patch(`${endpoint}/{id}`)
          .withPathParams('id', '$S{bookmarkId}')
          .withBearerToken(jwt)
          .withBody(dto)
          .expectStatus(200)
          .expectBodyContains(dto.title)
          .expectBodyContains(dto.description);
      });
    });

    describe('Delete bookmark by id', () => {
      it('should delete bookmark', () => {
        return pactum
          .spec()
          .delete(`${endpoint}/{id}`)
          .withPathParams('id', '$S{bookmarkId}')
          .withBearerToken(jwt)
          .expectStatus(204);
      });

      it('should get empty bookmarks', () => {
        return pactum
          .spec()
          .get('/bookmarks')
          .withBearerToken(jwt)
          .expectStatus(200)
          .expectJsonLength(0);
      });
    });
  });
});
