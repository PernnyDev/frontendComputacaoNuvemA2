import { render, screen } from '@testing-library/react';
import App from './App';

test('renders App component', () => {
  render(<App />);
  const headingElement = screen.getByRole('heading', { name: /Cadastro de Alunos/i });
  expect(headingElement).toBeInTheDocument();
});
