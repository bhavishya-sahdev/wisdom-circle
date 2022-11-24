import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { Response } from 'express';
import { hash, compare } from 'bcrypt';
import { verify } from 'jsonwebtoken';
import generateJwt from 'src/helpers/generateJwt';
import {
  AuthenticateUserDto,
  CreateUserDto,
  UpdateUserDto,
} from './user.types';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto, res: Response) {
    try {
      // hash the provided password
      const hashedPassword = await hash(createUserDto.password, 10);

      // save the data in the database
      await this.prisma.users.create({
        data: { ...createUserDto, password: hashedPassword },
      });

      // if successful, return a JWT with email and password
      return res.status(201).send({
        error: null,
        data: {
          token: generateJwt({
            email: createUserDto.email,
            password: createUserDto.password,
          }),
        },
      });
    } catch (e) {
      res.status(500).send({ error: e.message, data: null });
    }
  }

  async authenticate(authenticateUserDto: AuthenticateUserDto, res: Response) {
    try {
      let creds:
        | { email: string; password: string }
        | { phone_number: string; password: string }
        | null = null;

      // if the provided data has jwt in it then decode email and password from it
      // otherwise authenticate using email and password
      if ('jwt' in authenticateUserDto) {
        const payload = verify(
          authenticateUserDto.jwt.replace('Bearer ', ''),
          process.env.JWT_SECRET || '',
        ) as { email: string; password: string };

        creds = payload;
      } else if ('phone_number' in authenticateUserDto) {
        creds = {
          phone_number: authenticateUserDto.phone_number,
          password: authenticateUserDto.password,
        };
      } else {
        // Get the user by email from the database
        creds = {
          email: authenticateUserDto.email,
          password: authenticateUserDto.password,
        };
      }

      if (!creds)
        res.send({ error: { message: 'No credentials provided' }, data: null });

      // get the user based on the provided unique identifier (phone_number | email)
      const user = await this.prisma.users.findUnique({
        where: {
          ['phone_number' in creds ? 'phone_number' : 'email']:
            'phone_number' in creds ? creds.phone_number : creds.email,
        },
        select: { email: true, password: true },
      });

      if (user) {
        // verify provided password with the password hash in the database
        if (await compare(creds.password, user.password))
          // if successful, return a JWT with email and password
          res.status(200).send({
            error: null,
            data: {
              token: generateJwt({
                email: user.email,
                password: creds.password,
              }),
            },
          });
        else
          res.send({
            error: { field: 'password', message: 'Sorry! Incorrect password' },
            data: null,
          });
      } else {
        // if the user does not exist and the provided identifier is phone_number then return a phone_number based error
        if ('phone_number' in creds)
          res.send({
            error: {
              field: 'email',
              message: 'Please enter a valid phone number',
            },
            data: null,
          });
        // if the user does not exist and the provided identifier is email then return a email based error
        else
          res.send({
            error: {
              field: 'email',
              message: 'Please enter a valid email address',
            },
            data: null,
          });
      }
    } catch (e) {
      res.status(500).send({ error: e, data: null });
    }
  }

  async update(id: number, updateUserDto: UpdateUserDto, res: Response) {
    try {
      await this.prisma.users.update({ where: { id }, data: updateUserDto });
      return res.status(204);
    } catch (e) {
      return res.status(500).send({ error: e, data: null });
    }
  }

  async remove(id: number, res: Response) {
    await this.prisma.users.delete({ where: { id } });
    try {
      return res.status(204);
    } catch (e) {
      return res.status(500).send({ error: e, data: null });
    }
  }
}
