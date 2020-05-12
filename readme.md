## 组件库

### Switch
prop | type | description
-|-|-|
checked | boolean | 受控属性，如果使用该属性，必须在onChange事件接收到新状态时，自行更新checked值 |
defaultChecked | boolean | 默认状态 |
disabled | boolean | 禁止状态，此状态下按钮不可点击 |
loading | boolean | loading状态，此状态下按钮不可点击 |
checkedColor | string | on状态颜色 |
unCheckedColor | string | off状态颜色 |
checkedChildren | string | on状态文本 |
unCheckedChildren | string | off状态文本 |
onChange | function | 状态变化事件，接收一个bool类型参数，表示当前状态 |

