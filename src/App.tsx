import React from 'react';
import Table from "./components/Table/Table";
import styled from "styled-components";

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 50px;
`;

function App() {
  const names = [
    'Петров Иван Сергеевич',
    'Куценко Михаил Юрьевич',
    'Бондаренко Валентин Ильич',
    'Антонов Владимир Владимирович',
    'Иванов Иван Иванович'
  ];

  const emails = [
    'example@mail.ru',
    'mmm@gmail.com',
    '123qwerty@yandex.ru',
    'main@mail.ru'
  ];

  const cities = ['Белгород', 'Воронеж', 'Москва', 'Санкт-Петербург'];

  const chooseRandom = (array: any[]) => {
    return array[Math.floor(Math.random() * (array.length - 1))];
  };

  const header = [
    '#',
    'ФИО',
    'E-Mail',
    'Возраст',
    'Город',
  ]

  const data = Array.from(Array(171).keys()).map(i => [
    i + 1,
    chooseRandom(names),
    chooseRandom(emails),
    Math.floor(Math.random() * 30 + 20),
    chooseRandom(cities),
  ])

  return (
    <Container>
      <Table header={header} data={data} />
    </Container>
  );
}

export default App;
