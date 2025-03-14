import { NextRequest } from 'next/server';

// 模拟LLM响应的消息
const messages = [
  "Hello! How can I help you today?",
  "I'm an AI assistant designed to answer your questions.",
  "I can provide information on a wide range of topics.",
  "Feel free to ask me anything, and I'll do my best to assist you."
];

// 使用Next.js的流式响应功能
export async function POST(request: NextRequest) {
  const encoder = new TextEncoder();
  
  // 创建一个流式响应
  const stream = new ReadableStream({
    async start(controller) {
      try {
        // 添加初始延迟1.5秒
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // 逐句发送消息
        for (let i = 0; i < messages.length; i++) {
          const message = messages[i];
          const words = message.split(' ');
          
          // 逐词发送
          for (let j = 0; j < words.length; j++) {
            const word = words[j] + (j < words.length - 1 ? ' ' : '');
            
            // 创建JSON数据
            const data = JSON.stringify({
              type: 'content',
              content: word
            });
            
            // 发送数据
            controller.enqueue(encoder.encode(`data: ${data}\n\n`));
            
            // 词间延迟
            await new Promise(resolve => setTimeout(resolve, 50));
          }
          
          // 句间延迟
          await new Promise(resolve => setTimeout(resolve, 100));
        }
        
        // 发送完成信号
        controller.enqueue(
          encoder.encode(`data: ${JSON.stringify({ type: 'done' })}\n\n`)
        );
        
        controller.close();
      } catch (error) {
        controller.error(error);
      }
    }
  });
  
  // 返回流式响应
  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      'Connection': 'keep-alive'
    }
  });
}

// 为了兼容性，保留GET方法
export async function GET(request: NextRequest) {
  return POST(request);
} 