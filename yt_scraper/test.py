
def function(nums):
    myList = []
    for i in nums:
        new_nums = nums
        new_nums.remove(i)
        myList.append(sum(new_nums))
    
    return myList

array = [1, 2, 3, 4]

function(array)