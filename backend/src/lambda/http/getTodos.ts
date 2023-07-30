import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'
import { createLogger } from '../../utils/logger'
import { getTodosForUser as getTodosForUser } from '../../helpers/todos'
import { getUserId, parseNextKeyParameter, parseLimitParameter, parseOrderByParameter } from '../utils';
import { GetTodosResponse } from '../../models/GetTodosResponse'

const logger = createLogger('createTodoHandler')
// TODO: Get all TODO items for a current user
export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    // Write your code here
    let nextKey; // Next key to continue scan operation if necessary
    let limit; // Maximum number of elements to return
    let orderBy;
    try {
      // Parse query parameters
      nextKey = parseNextKeyParameter(event);
      limit = parseLimitParameter(event) || 10;
      orderBy = parseOrderByParameter(event) || '';
      const userId = getUserId(event);
      const response: GetTodosResponse = await getTodosForUser(userId, nextKey, limit, orderBy);
      return {
        statusCode: 200,
        body: JSON.stringify({
          items: response.items,
          nextKey: response.nextKey
        }),
      }
    } catch (error) {
      logger.error(`Error to get list: ${error.message}`)
      return {
        statusCode: 500,
        body: JSON.stringify({
          error: 'Can not get list!'
        })
      }
    }
  }
)

handler.use(
  cors({
    credentials: true
  })
)