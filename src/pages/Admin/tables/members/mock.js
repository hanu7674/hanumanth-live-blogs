import {faker} from '@faker-js/faker'
export const  mockUsers = (length) => {
  const createRowData = (rowIndex) => {
    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();
    const name = `${firstName} ${lastName}`;
    const gender = faker.person.gender(true);
    const avatar = faker.image.avatar();
    const city = faker.location.city();
    const street = faker.location.street();
    const email = faker.internet.email();
    const postcode = faker.location.zipCode();
    const phone = faker.phone.number();
    const amount = faker.finance.amount(1000, 90000);

    const age = Math.floor(Math.random() * 30) + 18;
    const stars = Math.floor(Math.random() * 10000);
    const followers = Math.floor(Math.random() * 10000);
    const rating = 2 + Math.floor(Math.random() * 3);
    const progress = Math.floor(Math.random() * 100);

    return {
      id: rowIndex + 1,
      firstName,
      name,
      lastName,
      avatar,
      city,
      street,
      postcode,
      email,
      phone,
      gender,
      age,
      stars,
      followers,
      rating,
      progress,
      amount
    };
  };

  return Array.from({ length }).map((_, index) => {
    return createRowData(index);
  });
}
export const mockTreeData = (options) => {
  const { limits, labels, getRowData } = options;
  const depth = limits.length;

  const data = [];
  const mock = (list, parentValue, layer = 0) => {
    const length = limits[layer];

    Array.from({ length }).forEach((_, index) => {
      const value = parentValue ? parentValue + '-' + (index + 1) : index + 1 + '';
      const children = [];
      const label = Array.isArray(labels) ? labels[layer] : labels;

      let row = {
        label: typeof label === 'function' ? label(layer, value, faker) : label + ' ' + value,
        value
      };

      if (getRowData) {
        row = {
          ...row,
          ...getRowData(layer, value)
        };
      }

      list.push(row);

      if (layer < depth - 1) {
        row.children = children;
        mock(children, value, layer + 1);
      }
    });
  };

  mock(data);

  return data;
}
const generateFakeData = (len) => {
  const fakeData = [];

  for (let i = 0; i < len; i++) {
    const fakeObject = {
      // by: faker.helpers.arrayElement(['metadata/userdata/users/nlgfYMAeNTgLBKf4iWebG74wGLE3']),
      createdAt: faker.date.between({from: '2023-12-15T00:00:00.000Z', to: '2023-12-22T00:00:00.000Z'}),
      updatedAt: faker.date.between({from: '2023-12-15T00:00:00.000Z', to: '2023-12-22T00:00:00.000Z'}),
      ipData: {
        ip: faker.internet.ip(),
        currency: faker.finance.currencyCode(),
        city: faker.helpers.arrayElement(['Hyderabad', 'Bangalore', 'Chennai', 'Delhi', 'Mumbai']),
        org: faker.company.name(),
        latitude: faker.location.latitude(),
        longitude: faker.location.longitude(),
        country_name: faker.location.country(),
        country_code: faker.location.countryCode(),
        region: faker.location.state(),
      },
      testimonial: `<p>${faker.lorem.paragraph()}</p>`,
      id: faker.string.uuid(),
    };
    fakeData.push(fakeObject);
  }

  return fakeData;
};
export const testimonials = generateFakeData(100);
export const signuplogs = (len) => {
  const fakeData = [];
  for (let i = 0; i < len; i++) {
    const fakeObject = {
      timestamp: faker.date.between({from: '2023-26-12T15:54:32.000Z', to: '2023-26-12T16:03:20.000Z'}),
      count: faker.number.int({min: 1, max: 6}),
      ipData: {
        ip: faker.internet.ip(),
        currency: faker.finance.currencyCode(),
        city: faker.helpers.arrayElement(['Hyderabad', 'Bangalore', 'Chennai', 'Delhi', 'Mumbai']),
        org: faker.company.name(),
        latitude: faker.location.latitude(),
        longitude: faker.location.longitude(),
        country_name: faker.location.country(),
        country_code: faker.location.countryCode(),
        region: faker.location.state(),
      },
      uid: faker.string.uuid(),
    }
    fakeData.push(fakeObject);
  }
  return fakeData
}