const Fastify = require('fastify')
const {ActionLog} = require('./models')
const fastify = Fastify()

fastify.post('/log', async (request, reply) => {
    const { plu, shop_id, action, date } = request.body
    try {
        await ActionLog.create({ plu, shop_id, action, date })
        reply.send( {message: 'Лог сохранен'})
    }
    catch (err) {
        reply.status(500).send({error: 'Ошибка при записи лога'})
    }
})

fastify.get('/history', async (request, reply) => {
    const { shop_id, plu, action, date_from, date_to, page = 1, limit = 10 } = request.query;

  const where = {};
  if (shop_id) where.shop_id = shop_id;
  if (plu) where.plu = plu;
  if (action) where.action = action;
  if (date_from && date_to) {
    where.date = {
      [Sequelize.Op.between]: [new Date(date_from), new Date(date_to)],
    };
  }

  try {
    const history = await ActionLog.findAll({
      where,
      offset: (page - 1) * limit,
      limit,
      order: [['date', 'DESC']],
    });

    const total = await ActionLog.count({ where });
    const totalPages = Math.ceil(total / limit);

    reply.send({
      data: history,
      pagination: {
        page,
        limit,
        total,
        totalPages,
      },
    });
  } catch (error) {
    reply.status(500).send({ error: 'Error fetching history' });
  }
})

fastify.listen({ port: 4000 }, (err, address) => {
    if (err) {
        console.error(err)
        process.exit(1)
    }
    console.log(`Логи запущены по адресу ${address}`)
})