# Page snapshot

```yaml
- generic [ref=e1]:
  - generic [ref=e2]:
    - navigation [ref=e3]:
      - link [ref=e4] [cursor=pointer]:
        - /url: /
        - img [ref=e5]:
          - generic [ref=e6]: TOD
      - generic [ref=e9]:
        - link "Log in" [ref=e10] [cursor=pointer]:
          - /url: /login
        - link "Sign up" [active] [ref=e11] [cursor=pointer]:
          - /url: /signup
    - main [ref=e12]:
      - heading "One place for everything you need to get done." [level=1] [ref=e13]
      - paragraph [ref=e14]: ToDo keeps all your tasks in one place. Create lists, add tasks, and check them off as you go.
      - link "Get started for free" [ref=e15] [cursor=pointer]:
        - /url: /signup
    - generic:
      - img "Todo list preview"
  - button "Open Next.js Dev Tools" [ref=e21] [cursor=pointer]:
    - generic [ref=e24]:
      - text: Rendering
      - generic [ref=e25]:
        - generic [ref=e26]: .
        - generic [ref=e27]: .
        - generic [ref=e28]: .
  - alert [ref=e29]
```