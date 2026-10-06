import { test, expect } from '@playwright/test';
import { faker } from '@faker-js/faker';
import { gerarCPF } from '../utils/cpf';

const url = ""

type EmployeeData = {
  cpf: string;
  name: string;
  rg: string;
};

const employeeData: EmployeeData = {
  cpf: gerarCPF(),
  name: faker.person.fullName(),
  rg: faker.string.numeric(9),
};

test('Deve listar os funcionários', async ({request}) => {
  const response = await request.get(`${url}`)
  expect(response.status()).toBe(200)
});

test('Deve criar um funcionário', async ({ request }) => {
  const response = await request.post(`${url}`, {
      data: {
        state: {
          employee: {
            isActive: true,
            name: employeeData.name,
            gender: faker.person.sex(),
            cpf: employeeData.cpf,
            birthDay: faker.date.between({ from: '2000-01-01', to: '2006-01-01' }).toISOString().split('T')[0],
            rg: employeeData.rg,
            role: faker.person.jobTitle(),
            usesEpi: true,
            caNumber: faker.string.numeric(9)
          }
        }
      }
  });
  expect(response.status()).toBe(201)
});

test('Deve falhar por body incompleto', async ({ request }) => {
  const response = await request.post(`${url}`, {
      data: {
        state: {
          employee: {
            isActive: true,
//            name: faker.person.fullName(),
            gender: faker.person.sex(),
            cpf: gerarCPF(),
            birthDay: faker.date.between({ from: '2000-01-01', to: '2006-01-01' }).toISOString().split('T')[0],
            rg: faker.string.numeric(9),
            role: faker.person.jobTitle(),
            usesEpi: true,
            caNumber: faker.string.numeric(9)
          }
        }
      }
  });
  expect(response.status()).toBe(400)
});

test('Deve falhar por existir um funcionário ativo cadastrado com os mesmos dados', async ({ request }) => {
  const response = await request.post(`${url}`, {
      data: {
        state: {
          employee: {
            isActive: true,
            name: employeeData.name,
            gender: faker.person.sex(),
            cpf: employeeData.cpf,
            birthDay: faker.date.between({ from: '2000-01-01', to: '2006-01-01' }).toISOString().split('T')[0],
            rg: employeeData.rg,
            role: faker.person.jobTitle(),
            usesEpi: true,
            caNumber: faker.string.numeric(9)
          }
        }
      }
  });
  expect(response.status()).toBe(409)
});

test('Deve falhar por tipos de dados incorretos', async ({ request }) => {
  const response = await request.post(`${url}`, {
      data: {
        state: {
          employee: {
            isActive: true,
            name: faker.string.numeric(9),
            gender: faker.string.numeric(9),
            cpf: faker.date.between({ from: '2000-01-01', to: '2006-01-01' }).toISOString().split('T')[0],
            birthDay: gerarCPF(),
            rg: faker.person.jobTitle(),
            role: faker.person.fullName(),
            usesEpi: faker.string.numeric(9),
            caNumber: faker.airline.aircraftType()
          }
        }
      }
  });
  expect(response.status()).toBe(400)
});

test('Deve falhar por ausencia do body', async ({ request }) => {
  const response = await request.post(`${url}`, {});
  expect(response.status()).toBe(400)
});