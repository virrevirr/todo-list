# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - generic [ref=e2]:
    - banner [ref=e3]:
      - link "Back to home" [ref=e5] [cursor=pointer]:
        - /url: /
        - img [ref=e6]
        - generic [ref=e8]: Back
      - generic:
        - img:
          - generic: TOD
    - generic [ref=e10]:
      - heading "Welcome back" [level=1] [ref=e11]
      - paragraph [ref=e12]: Log in to your account
      - generic [ref=e13]:
        - generic [ref=e14]:
          - generic [ref=e15]: Email
          - textbox "Email" [ref=e16]:
            - /placeholder: you@example.com
        - generic [ref=e17]:
          - generic [ref=e18]: Password
          - textbox "Password" [ref=e19]:
            - /placeholder: Your password
        - button "Log in" [ref=e20]
        - paragraph [ref=e21]:
          - text: Don't have an account?
          - link "Sign up" [ref=e22] [cursor=pointer]:
            - /url: /signup
  - button "Open Next.js Dev Tools" [ref=e28] [cursor=pointer]:
    - generic [ref=e31]:
      - text: Compiling
      - generic [ref=e32]:
        - generic [ref=e33]: .
        - generic [ref=e34]: .
        - generic [ref=e35]: .
```