"""大模型服务 - 集成通义千问 API"""

import httpx
import json
import logging
from typing import Optional, Dict, Any
from app.config import settings

logger = logging.getLogger(__name__)


class LLMService:
    """大模型服务类"""

    def __init__(self):
        self.api_key = settings.dashscope_api_key
        self.base_url = settings.dashscope_base_url
        self.model = settings.dashscope_model
        self.client = httpx.AsyncClient(timeout=60.0)

    async def generate_recipe(
        self,
        ingredients: list[str],
        cuisine: Optional[str] = None,
        preferences: Optional[Dict[str, Any]] = None,
    ) -> Optional[Dict[str, Any]]:
        """
        使用 AI 生成菜谱

        Args:
            ingredients: 食材列表
            cuisine: 菜系类型
            preferences: 用户偏好（辣度、难度等）

        Returns:
            生成的菜谱数据，失败返回 None
        """
        if not self.api_key:
            logger.error("通义千问 API Key 未配置")
            return None

        try:
            # 构建提示词
            prompt = self._build_recipe_prompt(ingredients, cuisine, preferences)

            # 调用 API
            response = await self._call_api(prompt)

            if not response:
                return None

            # 解析响应
            recipe_data = self._parse_recipe_response(response)
            return recipe_data

        except Exception as e:
            logger.error(f"生成菜谱失败: {str(e)}")
            return None

    async def chat(self, message: str, history: Optional[list] = None) -> str:
        """
        与 AI 烹饪助手聊天

        Args:
            message: 用户消息
            history: 对话历史

        Returns:
            AI 回复内容
        """
        if not self.api_key:
            logger.error("通义千问 API Key 未配置")
            return "抱歉，AI 服务暂未配置，无法回答您的问题。"

        try:
            # 构建系统提示
            system_prompt = """你是一位专业的烹饪助手，擅长解答各种烹饪相关问题。

回答要求：
1. 回答要实用、准确
2. 如果涉及食材挑选，给出具体标准
3. 如果涉及烹饪技巧，给出详细步骤
4. 语气友好、专业
5. 回答简洁明了，避免冗长

请用中文回答。"""

            # 构建对话历史
            messages = [{"role": "system", "content": system_prompt}]

            if history:
                for msg in history[-5:]:  # 只保留最近5轮对话
                    messages.append(
                        {
                            "role": msg.get("role", "user"),
                            "content": msg.get("content", ""),
                        }
                    )

            messages.append({"role": "user", "content": message})

            # 调用 API
            response_data = await self._call_chat_api(messages)

            if not response_data:
                return "抱歉，我现在无法回答这个问题，请稍后再试。"

            # 提取回复内容
            content = response_data.get("content", "").strip()
            return content

        except Exception as e:
            logger.error(f"聊天失败: {str(e)}")
            return f"抱歉，发生了错误：{str(e)}"

    def _build_recipe_prompt(
        self,
        ingredients: list[str],
        cuisine: Optional[str],
        preferences: Optional[Dict[str, Any]],
    ) -> str:
        """构建生成菜谱的提示词"""
        prompt_parts = [
            "请根据以下信息生成一份详细的菜谱：\n",
            f"现有食材：{', '.join(ingredients)}\n",
        ]

        if cuisine:
            prompt_parts.append(f"菜系风格：{cuisine}\n")

        if preferences:
            if preferences.get("spice_level"):
                spice_map = {
                    "none": "不辣",
                    "mild": "微辣",
                    "medium": "中辣",
                    "hot": "特辣",
                }
                prompt_parts.append(
                    f"辣度要求：{spice_map.get(preferences['spice_level'], '适中')}\n"
                )

            if preferences.get("difficulty"):
                diff_map = {"easy": "简单", "medium": "中等", "hard": "复杂"}
                prompt_parts.append(
                    f"难度要求：{diff_map.get(preferences['difficulty'], '中等')}\n"
                )

            if preferences.get("dietary_restrictions"):
                prompt_parts.append(
                    f"饮食限制：{', '.join(preferences['dietary_restrictions'])}\n"
                )

        prompt_parts.append("""
请严格按照以下 JSON 格式返回菜谱数据：

{
  "title": "菜谱名称",
  "description": "简短描述（50字以内）",
  "prep_time": 准备时间（分钟，整数）,
  "cook_time": 烹饪时间（分钟，整数）,
  "servings": 份数（整数，通常2-4）,
  "difficulty": "难度（easy/medium/hard）",
  "ingredients": [
    {"name": "食材名称", "quantity": "数量（如：2个、200g）", "optional": false}
  ],
  "steps": ["步骤1", "步骤2", "步骤3", ...],
  "tags": ["标签1", "标签2", ...],
  "calories": 卡路里（整数，可选）,
  "protein": 蛋白质（浮点数，可选）
}

要求：
1. 食材要尽可能使用现有食材，允许少量补充
2. 步骤要详细，每个步骤一句话
3. 只返回 JSON，不要其他文字
""")
        return "".join(prompt_parts)

    def _parse_recipe_response(self, response: str) -> Optional[Dict[str, Any]]:
        """解析菜谱生成响应"""
        try:
            # 尝试提取 JSON
            # 查找 JSON 开头和结尾
            start = response.find("{")
            end = response.rfind("}") + 1

            if start == -1 or end == 0:
                logger.error(f"响应中未找到有效的 JSON: {response}")
                return None

            json_str = response[start:end]
            recipe_data = json.loads(json_str)

            # 验证必需字段
            required_fields = ["title", "ingredients", "steps"]
            for field in required_fields:
                if field not in recipe_data:
                    logger.error(f"菜谱缺少必需字段: {field}")
                    return None

            return recipe_data

        except json.JSONDecodeError as e:
            logger.error(f"JSON 解析失败: {str(e)}, 响应: {response}")
            return None
        except Exception as e:
            logger.error(f"解析菜谱响应失败: {str(e)}")
            return None

    async def _call_api(self, prompt: str) -> Optional[str]:
        """调用通义千问 API（菜谱生成）"""
        try:
            payload = {
                "model": self.model,
                "messages": [{"role": "user", "content": prompt}],
                "temperature": 0.7,
                "top_p": 0.9,
                "max_tokens": 2000,
            }

            headers = {
                "Authorization": f"Bearer {self.api_key}",
                "Content-Type": "application/json",
            }

            response = await self.client.post(
                f"{self.base_url}/chat/completions", json=payload, headers=headers
            )

            if response.status_code != 200:
                logger.error(f"API 调用失败: {response.status_code}, {response.text}")
                return None

            data = response.json()

            # 提取内容
            choices = data.get("choices", [])
            if not choices:
                logger.error("API 响应中没有 choices")
                return None

            content = choices[0].get("message", {}).get("content", "")
            return content

        except Exception as e:
            logger.error(f"调用 API 失败: {str(e)}")
            return None

    async def _call_chat_api(self, messages: list) -> Optional[Dict[str, Any]]:
        """调用通义千问 API（聊天）"""
        try:
            payload = {
                "model": self.model,
                "messages": messages,
                "temperature": 0.8,
                "top_p": 0.9,
                "max_tokens": 1000,
            }

            headers = {
                "Authorization": f"Bearer {self.api_key}",
                "Content-Type": "application/json",
            }

            response = await self.client.post(
                f"{self.base_url}/chat/completions", json=payload, headers=headers
            )

            if response.status_code != 200:
                logger.error(f"API 调用失败: {response.status_code}, {response.text}")
                return None

            data = response.json()

            # 提取内容
            choices = data.get("choices", [])
            if not choices:
                logger.error("API 响应中没有 choices")
                return None

            message = choices[0].get("message", {})
            return {
                "content": message.get("content", ""),
                "role": message.get("role", "assistant"),
            }

        except Exception as e:
            logger.error(f"调用聊天 API 失败: {str(e)}")
            return None

    async def close(self):
        """关闭客户端连接"""
        await self.client.aclose()


# 创建全局服务实例
llm_service = LLMService()
