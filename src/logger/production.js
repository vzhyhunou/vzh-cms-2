import { format, transports } from 'winston';
import { utilities } from 'nest-winston';

export default {
  transports: [
    new transports.Console({
      format: format.combine(
        format.timestamp(),
        //format.ms(),
        utilities.format.nestLike('Nest', {
          colors: true,
          prettyPrint: true,
          processId: true,
          appName: true
        })
      )
    })
  ]
};
