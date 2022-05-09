const Sequelize = require("sequelize");

/**
 * Actions summary:
 *
 * removeColumn(participent1Id) => "Conversations"
 *
 */

const info = {
  revision: 3,
  name: "full_migration",
  created: "2022-05-09T12:58:59.690Z",
  comment: "",
};

const migrationCommands = (transaction) => [
  {
    fn: "removeColumn",
    params: ["Conversations", "participent1Id", { transaction }],
  },
];

const rollbackCommands = (transaction) => [
  {
    fn: "addColumn",
    params: [
      "Conversations",
      "participent1Id",
      {
        type: Sequelize.INTEGER,
        field: "participent1Id",
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
        references: { model: "Profiles", key: "id" },
        allowNull: true,
      },
      { transaction },
    ],
  },
];

const pos = 0;
const useTransaction = true;

const execute = (queryInterface, sequelize, _commands) => {
  let index = pos;
  const run = (transaction) => {
    const commands = _commands(transaction);
    return new Promise((resolve, reject) => {
      const next = () => {
        if (index < commands.length) {
          const command = commands[index];
          console.log(`[#${index}] execute: ${command.fn}`);
          index++;
          queryInterface[command.fn](...command.params).then(next, reject);
        } else resolve();
      };
      next();
    });
  };
  if (useTransaction) return queryInterface.sequelize.transaction(run);
  return run(null);
};

module.exports = {
  pos,
  useTransaction,
  up: (queryInterface, sequelize) =>
    execute(queryInterface, sequelize, migrationCommands),
  down: (queryInterface, sequelize) =>
    execute(queryInterface, sequelize, rollbackCommands),
  info,
};
