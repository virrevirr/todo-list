# Page snapshot

```yaml
- generic [ref=e1]:
  - generic [ref=e2]:
    - link [ref=e3] [cursor=pointer]:
      - /url: /
      - img [ref=e4]:
        - generic [ref=e5]: TOD
    - generic [ref=e8]:
      - heading "Create an account" [level=1] [ref=e9]
      - paragraph [ref=e10]: Start managing your tasks today
      - generic [ref=e11]:
        - generic [ref=e12]:
          - generic [ref=e13]: First name
          - textbox "First name" [active] [ref=e14]:
            - /placeholder: Astrid
        - generic [ref=e15]:
          - generic [ref=e16]: Last name
          - textbox "Last name" [ref=e17]:
            - /placeholder: Lindqvist
        - generic [ref=e18]:
          - generic [ref=e19]: Email
          - textbox "Email" [ref=e20]:
            - /placeholder: you@example.com
            - text: test+1773014756033@example.com
        - generic [ref=e21]:
          - generic [ref=e22]: Password
          - textbox "Password" [ref=e23]:
            - /placeholder: Min. 6 characters
            - text: testpassword123
        - button "Create account" [ref=e24]
        - paragraph [ref=e25]:
          - text: Already have an account?
          - link "Log in" [ref=e26] [cursor=pointer]:
            - /url: /login
  - button "Open Next.js Dev Tools" [ref=e32] [cursor=pointer]:
    - img [ref=e33]
  - alert [ref=e36]
```