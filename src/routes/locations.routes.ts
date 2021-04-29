import { response, Router } from 'express';
import knex from '../database/connection';
import multer from 'multer';
import multerConfig from '../config/multer';
import { celebrate, Joi } from 'celebrate';
import isAuthenticated from '../middlewares/isAuthenticated';

const locationsRouter = Router();
const upload = multer(multerConfig);

locationsRouter.use(isAuthenticated);

locationsRouter.get('/', async (req, res) => {
    const { city, state, items } = req.query;

    // no params?
    if (!city && !state && !items) {
        const locations = await knex('locations').select('*');
        return res.json(locations);
    }

    const parsedItems = String(items)
        .split(',')
        .map(e => Number(e));
    
    const locations = await knex('locations')
        .join('location_items', 'locations.id', '=', 'location_items.location_id')
        .whereIn('location_items.item_id', parsedItems)
        .where('city', String(city))
        .where('state', String(state))
        .distinct()
        .select('locations.*');
    
    return res.json(locations);
});

locationsRouter.get('/:id', async (req, res) => {
    const { id } = req.params;

    const location = await knex('locations').where('id', id).first();

    if (!location) {
        return res.status(400).json({
            message: "Location not found!"
        });
    }

    const items = await knex('items')
        .join('location_items', 'items.id', '=', 'location_items.item_id')
        .where('location_items.location_id', id)
        .select('items.title');

    return res.json({ ...location, items });
});

locationsRouter.post('/', celebrate(
    {
        body: Joi.object().keys({
            name: Joi.string().required(),
            email: Joi.string().required().email(),
            phone: Joi.string().required(),
            latitude: Joi.number().required(),
            longitude: Joi.number().required(),
            city: Joi.string().required(),
            state: Joi.string().required().max(2),
            items: Joi.array().items(Joi.number()).required()
        })
    },
    {
        abortEarly: false
    }
), async (req, res) => {
    const { 
        name,
        email,
        phone,
        latitude,
        longitude,
        city,
        state,
        items
    } = req.body;

    const location = { 
        image: "fake-image.jpg",
        name,
        email,
        phone,
        latitude,
        longitude,
        city,
        state
    };

    const transaction = await knex.transaction();

    // FIXME: handle if data is not completely filled
    const recordID = await transaction('locations').insert(location);
    const location_id = recordID[0];

    const locationItems = items.map(async (item_id: number) => {
        const selectedItem = await transaction('items').where('id', item_id).first();
        
        if (!selectedItem) {
            return res.status(400).json({
                message: "Item not found!"
            });
        }

        return { item_id, location_id }
    });

    await transaction('location_items').insert(locationItems);

    await transaction.commit();

    return res.json({ id: location_id,...location });
});

locationsRouter.put('/:id', upload.single('image'), async(req, res) => {
    const { id } = req.params;
    const image = req.file.filename;

    const location = await knex('locations')
        .where('id', id)
        .first();
    
    if (!location) {
        return res.status(400).json({
            message: 'Location not found!'
        });
    }

    const locationUpdated = {
        ...location,
        image
    };

    await knex('locations')
        .update(locationUpdated)
        .where('id', id);
    
    return res.json(locationUpdated);
});

export default locationsRouter;