const faker = require('faker');
const times = require('lodash/times');
const random = require('lodash/random');
const createData = db => {
	// db.user
	// 	.bulkCreate(
	// 		times(10, () => ({
	// 			email: `${faker.name.firstName()}@${faker.name.lastName()}.com`,
	// 			password: '123456'
	// 		}))
	// 	)
	// 	.then(console.log);
	db.room
		.bulkCreate(
			times(10, () => ({
				hostId: random(1, 10),
				roomName: faker.name.jobArea()
			}))
		)
		.then(console.log);
	db.message.bulkCreate(
		times(10, () => ({
			userId: random(1, 10),
			roomId: random(1, 10),
			message: faker.lorem.sentence(20)
		}))
	);
	db.like.bulkCreate(
		times(10, () => ({
			userId: random(1, 10),
			roomId: random(1, 10),
			songId: random(1, 10)
		}))
	);
	db.song.bulkCreate(
		times(10, () => ({
			userId: random(1, 10),
			roomId: random(1, 10),
			spotifyId: random(100, 999),
			songImg: faker.image.imageUrl(50, 50),
			songLength: random(150, 240)
		}))
	);
};

module.exports = createData;