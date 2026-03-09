# Page snapshot

```yaml
- generic [ref=e1]:
  - button "Open Next.js Dev Tools" [ref=e7] [cursor=pointer]:
    - img [ref=e8]
  - alert [ref=e11]
  - generic [ref=e12]:
    - complementary [ref=e15]:
      - generic [ref=e17]:
        - button "Cancel" [ref=e18]: ✕
        - textbox "List name" [active] [ref=e19]: E2E List
        - button "Add" [ref=e20]
      - navigation [ref=e21]:
        - generic [ref=e22] [cursor=pointer]:
          - generic [ref=e23]: To-do list
          - button "Delete To-do list" [ref=e24]: ✕
        - generic [ref=e25] [cursor=pointer]:
          - generic [ref=e26]: Shopping
          - button "Delete Shopping" [ref=e27]: ✕
        - generic [ref=e28] [cursor=pointer]:
          - generic [ref=e29]: Sushilistan
          - button "Delete Sushilistan" [ref=e30]: ✕
      - button "Log out" [ref=e32]
    - generic [ref=e33]:
      - banner [ref=e34]:
        - button "Open sidebar" [ref=e35]:
          - img [ref=e36]
        - img [ref=e39]:
          - generic [ref=e40]: TOD
        - button "Profile" [ref=e43]:
          - generic [ref=e44]: TO
      - main [ref=e45]:
        - generic [ref=e47]:
          - heading "To-do list" [level=2] [ref=e48]
          - generic [ref=e49]:
            - textbox "Add a new task..." [ref=e50]
            - button "Add" [ref=e51]
          - paragraph [ref=e52]: No tasks yet - add one above.
```