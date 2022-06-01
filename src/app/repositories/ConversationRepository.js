const { Op } = require("sequelize");
const BaseRepository = require("./BaseRepository");
const Conversation = require("../models").Conversation;

class ConversationRepository extends BaseRepository {
    constructor(Conversation) {
        super(Conversation);
    }

    findOrCreate(participent1Id, participent2Id) {
        return this.model.findOrCreate({
            where: {
                participent1Id: Math.min(participent1Id, participent2Id),
                participent2Id : Math.max(participent1Id, participent2Id)
            },
            defaults: {
                creation_date: new Date(),
                createdAt: new Date(),
                updatedAt: new Date(),
            }
        });
    }

    findAllByProfileId(id) {
        return this.model.findAll({
            where: {
                [Op.or]: [
                    { participent1Id: id },
                    { participent2Id: id }
                ]
            }
        })
    }

    findById(id) {
        return this.model.findOne({
            where: {
                id: id
            }
        })
    }
}

module.exports = new ConversationRepository(Conversation);