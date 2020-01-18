def flatten(alist):
    i = 0
    new_list = []
    proxy_list = []
    while (i != len(alist)):
        if (type(alist[i]) == int or type(alist[i]) == str or type(alist[i]) == float):
            new_list.append(alist[i])
            i += 1
        else:
            for j in alist[i]:
                new_list.append(j)
            i += 1
    for k in new_list:
        if (type(k) == int or type(k) == str or type(k) == float):
            proxy_list.append('true')
        else:
            proxy_list.append('false')
    if 'false' not in proxy_list:
        return (new_list)
    else:
        return flatten(new_list)


l = [1, 2, 3, ['klm', 'l', 3], 'h', [3, 4, 5], [[[1]]]]
print(flatten(l))
