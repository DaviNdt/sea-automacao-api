export function gerarCPF(): string {
  const numeros = Array.from({ length: 9 }, () =>
    Math.floor(Math.random() * 10)
  );

  const calcularDigito = (nums: number[]): number => {
    const soma = nums.reduce(
      (total, num, index) => total + num * (nums.length + 1 - index),
      0
    );

    const resto = soma % 11;
    return resto < 2 ? 0 : 11 - resto;
  };

  numeros.push(calcularDigito(numeros));
  numeros.push(calcularDigito(numeros));

  return numeros.join('');
}